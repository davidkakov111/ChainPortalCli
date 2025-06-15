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
}
