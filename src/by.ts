import { By as ByBase } from 'selenium-webdriver';

export class By extends ByBase {
  static content(content: string): By {
    return ByBase.xpath(`//*[contains(text(), '${content}')]`);  
  }

  static contentWithContext(content: string): By {
    return ByBase.xpath(`.//*[contains(text(), '${content}')]`)
  }

  static classAndContent(className: string, content: string) {
    return ByBase.xpath(`//*[contains(@class, '${className}') and contains(.//*, '${content}')]`);
  }

  static classAndContentWithContext(className: string, content: string) {
    return ByBase.xpath(`.//*[contains(@class, '${className}') and contains(.//*, '${content}')]`);
  }

  static exactContentWithContext(content: string) {
    return ByBase.xpath(`.//*[normalize-space() = '${content}']`);
  }

  static exactContent(content: string) {
    return ByBase.xpath(`.//*[normalize-space() = '${content}']`);
  }

  static tagAndContent(tag: string, content: string) {
    return ByBase.xpath(`//${tag}[contains(text(), '${content}')]`)
  }
}
