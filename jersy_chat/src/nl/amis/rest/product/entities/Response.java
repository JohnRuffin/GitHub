//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package nl.amis.rest.product.entities;

import java.util.Date;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Response {
    public String text;
    public String author;
    public long time;

    public Response(String author, String text) {
        this.author = author;
        this.text = text;
        this.time = (new Date()).getTime();
    }

    public Response() {
    }
}
