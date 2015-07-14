//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package nl.amis.rest.product.services;

import java.util.ArrayList;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

@Path("/products")
public class Product {
    public Product() {
    }

    @GET
    @Produces({"application/json", "application/xml"})
    public Response getProducts() {
        try {
            ArrayList t = new ArrayList();
            nl.amis.rest.product.entities.Product xbox = new nl.amis.rest.product.entities.Product();
            xbox.setName("xbox");
            xbox.setDescription("Xbox one");
            xbox.setOnStock(Integer.valueOf(100));
            t.add(xbox);
            nl.amis.rest.product.entities.Product playstation = new nl.amis.rest.product.entities.Product();
            playstation.setName("playstation");
            playstation.setDescription("Sony Playstation 4");
            playstation.setOnStock(Integer.valueOf(50));
            t.add(playstation);
            return Response.ok(t.toArray(new nl.amis.rest.product.entities.Product[t.size()])).build();
        } catch (Throwable var4) {
            var4.printStackTrace();
            return Response.status(Status.NOT_ACCEPTABLE).build();
        }
    }

    @GET
    @Path("/{product}")
    @Produces({"application/json", "application/xml"})
    public Response getProduct(@PathParam("product") String name) {
        try {
            nl.amis.rest.product.entities.Product t = new nl.amis.rest.product.entities.Product();
            if("xbox".equalsIgnoreCase(name)) {
                t.setName("xbox");
                t.setDescription("Xbox one");
                t.setOnStock(Integer.valueOf(100));
            } else {
                if(!"playstation".equalsIgnoreCase(name)) {
                    return Response.status(Status.NOT_ACCEPTABLE).build();
                }

                t.setName("playstation");
                t.setDescription("Sony Playstation 4");
                t.setOnStock(Integer.valueOf(50));
            }

            return Response.ok(t).build();
        } catch (Throwable var3) {
            var3.printStackTrace();
            return Response.status(Status.NOT_ACCEPTABLE).build();
        }
    }
}
