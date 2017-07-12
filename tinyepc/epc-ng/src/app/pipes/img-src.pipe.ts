import {Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'backgroundSrc'
})
export class ImgSrcPipe implements PipeTransform{


  constructor(private sanitizer:DomSanitizer){}

  transform(src: string) {

	return  this.sanitizer.bypassSecurityTrustStyle('url(' + src+ ')');
  }
}
