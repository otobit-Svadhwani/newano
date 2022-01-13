import { EventEmitter, Injectable, Output } from '@angular/core';
// import { S3 } from "aws-sdk";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { StoreTokenService } from './store-token.service';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  public imageLocationUrl = new EventEmitter<any>(null);
  constructor(
    storeTokenService: StoreTokenService,
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {}

  async uploadFile(file) {
    const contentType = file.type;
    const bucket = new S3({
      accessKeyId: 'AKIA6FVO5N22QUZE7P3V',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });
    console.log(bucket);
    const params = {
      Bucket: 'ano-bucket',
      //   this.FOLDER +
      Key: file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType,
    };
    console.log(params);
    let that = this;
    await bucket.upload(params, function (err, data) {
      console.log('bucket upload call');
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      console.log(data.Location);
      that.imageLocationUrl.emit(data.Location);
      localStorage.setItem('ImgUrl', data.Location);

      return true;
    });
    //for upload progress
    // bucket
    //   .upload(params)
    //   .on("httpUploadProgress", function (evt) {
    //     console.log(evt.loaded + " of " + evt.total + " Bytes");
    //   })
    //   .send(function (err, data) {
    //     if (err) {
    //       console.log("There was an error uploading your file: ", err);
    //       return false;
    //     }
    //     console.log("Successfully uploaded file.", data);
    //     console.log("in location", data.location);
    //     return true;
    //   });
  }

  uploadImageCart(id, data) {
    return this.httpClient.put(
      this.commonService.envUrl() + 'cart/' + id,
      data
    );
  }
}
