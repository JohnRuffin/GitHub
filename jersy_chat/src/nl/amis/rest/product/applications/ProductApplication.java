//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package nl.amis.rest.product.applications;

import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.core.Application;
import nl.amis.rest.product.services.Product;

public class ProductApplication extends Application {
    public ProductApplication() {
    }

    public Set<Class<?>> getClasses() {
        HashSet classes = new HashSet();
        classes.add(Product.class);
        return classes;
    }
}
