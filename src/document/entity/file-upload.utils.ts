import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { extname, join } from "path";
const path = require('path');
var fs = require('fs');

export class FileUpload {
    /**
     *
     */
    constructor(private configService: ConfigService) {
    }

    getStaticFolderName() {
        console.log(this.configService.get<string>('staticFolederName'));

        return this.configService.get<string>('staticFolederName');
    }

    getbaseUrl() {
        console.log(this.configService.get<string>('baseUrl'));

        return this.configService.get<string>('baseUrl');
    }
}

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(8)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${randomName}${fileExtName}`);
};

export const statticFileLocation = "static-files";

export const fileLocation = (req, file, callback) => {
    // let dir = path.join(__dirname, `./files/${req.params.owner}/${req.params.oid}`)
    let dir = join(statticFileLocation, req.params.owner, req.params.oid);
    // `./${statticFileLocation}/${req.params.owner}/${req.params.oid}`;

     console.log('path1',dir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        }, (e) => {
            console.log(e);
        });
    }
    callback(null, dir);
}