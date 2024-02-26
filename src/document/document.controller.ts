import { DocumentOwner } from './entity/document-owner.entity';
import { editFileName, editFileNameForStorage, fileLocation, fileLocationForStorage } from './entity/file-upload.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { Crud, CrudController, CrudRequest } from '@nestjsx/crud';
import { Documents } from './entity/document.entity';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  Req,
  Get,
  StreamableFile,
  Res,
  UseGuards,
  Query,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { join } from 'path';
import { createReadStream } from 'fs';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { AuditService } from 'src/audit/audit.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Country } from 'src/country/entity/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/entity/project.entity';
import { Repository } from 'typeorm';
import { StorageService } from 'src/storage/storage.service';
import { StorageFile } from 'src/storage/storage-file';
const multer = require('multer');

@Crud({
  model: {
    type: Documents,
  },
})
@Controller('document')
export class DocumentController implements CrudController<Documents> {
  constructor(
    public service: DocumentService,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private storageService: StorageService
  ) {}

  @Post('upload')
  uploadFile(@Body() file: Documents) {}



  @Post('uploadFileAnonymous/:oid/:owner')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: fileLocation,
        filename: editFileName,
      }),
    }),
  )
  async uploadFileAnonymous(
    @UploadedFile() file,
    @Req() req: CrudRequest,
    @Param('oid') oid,
    @Param('owner') owner,
  ) {
    const existingProject = await this.projectRepository.findOne({
      where: { id: oid, projectApprovalStatus: null },
    });

    if (existingProject) {
      const docowner: DocumentOwner = (<any>DocumentOwner)[owner];
      const path = join(owner, oid, file.filename);
      const doc = new Documents();
      doc.documentOwnerId = oid;
      doc.documentOwner = docowner;
      doc.fileName = file.originalname;
      doc.mimeType = file.mimetype;
      doc.relativePath = path;

      const audit: AuditDto = new AuditDto();
      audit.action = file.originalname + ' Uploaded';
      audit.comment = 'Document Uploaded';
      audit.actionStatus = 'Uploaded';

      this.auditService.createAnonymous(audit);
      const country = new Country();
      country.id = 0;
      doc.country = country;
      const newdoc = await this.service.saveDocument(doc);
    }
  }

  @Post('upload3/:oid')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile3(@UploadedFile() file, @Param('oid') oid) {}

  @UseGuards(JwtAuthGuard)
  @Post('delete/:docId')
  async deleteDoc(@Param('docId') docId: number): Promise<any> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Document Deleted';
    audit.comment = 'Document Deleted';
    audit.actionStatus = 'Deleted';
    const doc = await this.service.findOne(docId)
    try {
       await this.storageService.delete(doc.relativePath);
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("image not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }
    await this.auditService.create(audit);

    return await this.service.deleteDocument(doc);
  }

  @Post('anonymousDelete/:docId')
  async deleteDocAnonymous(@Param('docId') docId: number): Promise<any> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Anonymous Document Deleted';
    audit.comment = 'Anonymous Document Deleted';
    audit.actionStatus = 'Deleted';
    const doc = await this.service.findOne(docId)
    try {
       await this.storageService.delete(doc.relativePath);
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("image not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }

    this.auditService.create(audit);

    return this.service.anonymousDeleteDocument(doc);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getDocument/:oid/:owner')
  async getDocuments(
    @Param('oid') oid: number,
    @Param('owner') owner: DocumentOwner,
  ) {
    const docowner: DocumentOwner = (<any>DocumentOwner)[owner];

    let countryIdFromTocken: number;
    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
    ]);

    return await this.service.getDocuments(oid, docowner, countryIdFromTocken);
  }

  @Get('getDocumentAnonymous/:oid/:owner')
  async getDocumentsAnonymous(
    @Param('oid') oid: number,
    @Param('owner') owner: DocumentOwner,
  ) {
    const docowner: DocumentOwner = (<any>DocumentOwner)[owner];

    return await this.service.getDocuments(oid, docowner, 0);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getDocumentsForViweCountry')
  async getDocumentsForViweCountry(@Query('oid') oid: number) {
    let countryIdFromTocken: number;
    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
    ]);

    return await this.service.getDocumentsForViweCountry(
      oid,
      countryIdFromTocken,
    );
  }
 

  @UseGuards(JwtAuthGuard)
  @Post('upload2/:oid/:owner')
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    })
  )
  async uploadFile2(
    @UploadedFile() file,
    @Param('oid') oid,
    @Param('owner') owner,
    
  ) {
    const fileName=editFileNameForStorage(file);
    const location=fileLocationForStorage(owner,oid)

    try {
      await this.storageService.save(
        location + fileName,
        file.mimetype,
        file.buffer,
        [{ mediaId: fileName }]
      );
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("file not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }

   const docowner: DocumentOwner = (<any>DocumentOwner)[owner];
    const doc = new Documents();
    doc.documentOwnerId = oid;
    doc.documentOwner = docowner;
    doc.fileName = file.originalname;
    doc.mimeType = file.mimetype;
    doc.relativePath = location + fileName;

    const audit: AuditDto = new AuditDto();
    audit.action = file.originalname + ' Uploaded';
    audit.comment = 'Document Uploaded';
    audit.actionStatus = 'Uploaded';

    this.auditService.create(audit);

    let countryIdFromTocken: number;
    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
    ]);
    const country = new Country();
    country.id = countryIdFromTocken;
    doc.country = country;

    const newdoc = await this.service.saveDocument(doc);

  }
  @Get('downloadDocument/:state/:did')
  async downloadDocuments(
    @Res({ passthrough: true }) res,
    @Param('did') did: number,
    @Param('state') state: string,
  ): Promise<StreamableFile> {
    const doc: Documents = await this.service.getDocument(did);
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get(doc.relativePath);
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("image not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }
    res.set({
      'Content-Type': `${doc.mimeType}`,
      'Content-Disposition': `${state}; filename=${doc.fileName}`,
    });


    return new StreamableFile(storageFile.buffer);
  }
  @Get('downloadReport/:reportname')
  async downloadReport(
    @Res({ passthrough: true }) res,
   
    @Param('reportname') reportname: string,
  ): Promise<StreamableFile> {
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get('public/'+reportname);
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("Report not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=${reportname}`,
    });


    return new StreamableFile(storageFile.buffer);
  }

}
