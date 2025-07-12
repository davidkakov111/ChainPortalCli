import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  isMobileDevice(): boolean {
    const ua = navigator.userAgent || (window as any).opera;
    
    const isModernMobile = (navigator as any).userAgentData?.mobile === true;
    
    const isLegacyMobile = /android|webos|iphone|ipad|ipod|huawei|honor|sm-|mi|redmi|blackberry|iemobile|opera mini|oneplus/i.test(ua.toLowerCase());

    return isModernMobile || isLegacyMobile;
  }      

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new File([u8arr], filename, { type: mime });
  }  
}
