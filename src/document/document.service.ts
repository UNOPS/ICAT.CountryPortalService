import { ConfigService } from '@nestjs/config';
import { statticFileLocation } from './entity/file-upload.utils';
import { DocumentOwner } from './entity/document-owner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { Documents } from './entity/document.entity';
import { join } from 'path';
import { Country } from 'src/country/entity/country.entity';
import { In } from 'typeorm';
const fs = require('fs');
const path = require('path');

@Injectable()
export class DocumentService extends TypeOrmCrudService<Documents> {
  constructor(
    @InjectRepository(Documents) repo,
    private configService: ConfigService,
  ) {
    super(repo);
  }

  async saveDocument(doc: Documents) {
    return await this.repo.save(doc).catch((error) => {});
  }

  async deleteDocument(docId: number): Promise<any> {
    const document = await this.repo
      .createQueryBuilder('document')
      .where('id=:id', {
        id: docId,
      })
      .getOne();

    if (document) {
      const del = await this.repo.delete(document);
      this.deleteFile(document.relativePath);
    }

    return document;
  }

  async anonymousDeleteDocument(docId: number): Promise<any> {
    const document = await this.repo
      .createQueryBuilder('document')
      .where('countryId = :countryId AND id=:id', {
        countryId: 0,
        id: docId,
      })
      .getOne();

    if (document) {
      const del = await this.repo.delete(document).catch((a) => {
        return a;
      });

      this.deleteFile(document.relativePath);
    }

    return document;
  }

  deleteFile(filepath: string) {
    const rootPath = path.resolve('./');
    const fullfilePath = join(rootPath, statticFileLocation, filepath);

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
    const country = new Country();
    country.id = countryIdFromTocken;
    const documenst = await this.repo.find({
      where: {
        documentOwnerId: oid,
        documentOwner: owner,
        country: { id: In([0, countryIdFromTocken]) },
      },
    });

    const base = process.env.BASE_URL;
    documenst.forEach((a) => {
      a.url = `${base}/document/downloadDocument/attachment/${a.id}`;
    });

    return documenst;
  }

  async getDocumentsForViweCountry(
    oid: number,
    countryIdFromTocken: number,
  ): Promise<Documents[]> {
    const country = new Country();
    country.id = countryIdFromTocken;
    const documenst = await this.repo.find({
      where: { documentOwnerId: oid, country: country },
    });

    const base = process.env.BASE_URL;
    documenst.forEach((a) => {
      a.url = `${base}/document/downloadDocument/attachment/${a.id}`;
    });

    return documenst;
  }
}
