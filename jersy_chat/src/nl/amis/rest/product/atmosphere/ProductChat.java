//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package nl.amis.rest.product.atmosphere;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import nl.amis.rest.product.entities.Message;
import nl.amis.rest.product.entities.Response;
import org.atmosphere.annotation.Broadcast;
import org.atmosphere.annotation.Suspend;

@Path("/")
public class ProductChat {
    public ProductChat() {
    }

    @Suspend(
        contentType = "application/json"
    )
    @GET
    public String suspend() {
        return "";
    }

    @Broadcast(
        writeEntity = false
    )
    @POST
    @Produces({"application/json"})
    public Response broadcast(Message message) {
        return new Response(message.author, message.message);
    }
}
