import { ConfigService } from '@nestjs/config';
import { AppModule } from './../app.module';
import { statticFileLocation } from './entity/file-upload.utils';
import { promises } from 'fs';
import { DocumentOwner } from './entity/document-owner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
  Module,
} from '@nestjs/common';
import { Documents } from './entity/document.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Country } from 'src/country/entity/country.entity';
import { In } from 'typeorm';
var fs = require('fs');
var path = require('path');

@Injectable()
export class DocumentService extends TypeOrmCrudService<Documents> {
  constructor(
    @InjectRepository(Documents) repo,
    private configService: ConfigService,
  ) {
    super(repo);
  }

  async saveDocument(doc: Documents) {
    return await this.repo.save(doc).catch((error) => {
      console.log(error);
    });
  }

  async deleteDocument(docId: number): Promise<any> {
    let document = await this.repo
      .createQueryBuilder('document')
      .where('id=:id', {
        id: docId,
      })
      .getOne();
    console.log('document.....', document);
    if (document) {
      console.log('document Deleted.....', document);
      let del = await this.repo.delete(document);
      // console.log("document.....1",del)
      this.deleteFile(document.relativePath);
    }

    // let doc = this.getDocument(docId).then((val) => {
    //   return this.repo
    //     .delete(val)
    //     .then((res) => {
    //       this.deleteFile(val.relativePath);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });

    // });
    return document;
  }

  async anonymousDeleteDocument(docId: number): Promise<any> {
    let document = await this.repo
      .createQueryBuilder('document')
      .where('countryId = :countryId AND id=:id', {
        countryId: 0,
        id: docId,
      })
      .getOne();

    // let document = await this.repo.findOne({
    //   // relations: ['country'],
    //   where: { id: docId, countryId: 0 },
    // }); //this.getDocument(docId);
    console.log('document.....', document);
    if (document) {
      let del = await this.repo.delete(document).catch((a) => {
        return a;
      });
      // console.log("document.....1",del)
      this.deleteFile(document.relativePath);
    }

    // let doc = this.getDocument(docId).then((val) => {
    //   return this.repo
    //     .delete(val)
    //     .then((res) => {
    //       this.deleteFile(val.relativePath);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });

    // });
    return document;
  }

  deleteFile(filepath: string) {
    let rootPath = path.resolve('./');
    let fullfilePath = join(rootPath, statticFileLocation, filepath);
    console.log(fullfilePath);
    if (fs.existsSync(fullfilePath)) {
      fs.unlinkSync(fullfilePath);
    }
  }

  async getDocument(id: number): Promise<Documents> {
    return await this.repo.findOne({ where: { id: id } });
  }

  async getDocuments(
    oid: number,
    owner: DocumentOwner,
    countryIdFromTocken: number,
  ): Promise<Documents[]> {
    let country = new Country();
    country.id = countryIdFromTocken;
    let documenst = await this.repo.find({
      where: {
        documentOwnerId: oid,
        documentOwner: owner,
        country: { id: In([0, countryIdFromTocken]) },
      },
    });
    console.log(documenst);
    const base = this.configService.get<string>('baseUrl');
    documenst.forEach((a) => {
      // a.url = `${base}${a.relativePath}`;
      a.url = `${base}document/downloadDocument/attachment/${a.id}`;
    });

    return documenst;
  }

  async getDocumentsForViweCountry(
    oid: number,
    countryIdFromTocken: number,
  ): Promise<Documents[]> {
    let country = new Country();
    country.id = countryIdFromTocken;
    let documenst = await this.repo.find({
      where: { documentOwnerId: oid, country: country },
    });
    console.log(documenst);
    const base = this.configService.get<string>('baseUrl');
    documenst.forEach((a) => {
      // a.url = `${base}${a.relativePath}`;
      a.url = `${base}document/downloadDocument/attachment/${a.id}`;
    });

    return documenst;
  }
}
