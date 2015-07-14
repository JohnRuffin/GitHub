//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package nl.amis.rest.product.entities;

import com.sun.jersey.server.linking.Binding;
import com.sun.jersey.server.linking.Link;
import com.sun.jersey.server.linking.Ref;
import com.sun.jersey.server.linking.Ref.Style;
import java.net.URI;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
@Link(
    value =         @Ref(
            resource = nl.amis.rest.product.services.Product.class,
            method = "getProduct",
            bindings = {                @Binding(
                    name = "product",
                    value = "${instance.name}"
                )},
            style = Style.ABSOLUTE_PATH
        ),
    rel = "self"
)
public class Product {
    private String name;
    private String description;
    private Integer onStock;
    @Ref(
        resource = nl.amis.rest.product.services.Product.class,
        method = "getProduct",
        bindings = {            @Binding(
                name = "product",
                value = "${instance.name}"
            )},
        style = Style.ABSOLUTE_PATH
    )
    private URI self;

    public Product() {
    }

    public URI getSelf() {
        return this.self;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }

    public void setOnStock(Integer onStock) {
        this.onStock = onStock;
    }

    public Integer getOnStock() {
        return this.onStock;
    }
}
