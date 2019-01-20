import { IAddress } from "./../organisations/models/Organisation";
import { OrganisationService } from "../organisations/services/organisation-service";
import { IOrganisation } from "../organisations/models/Organisation";
import * as socketIo from "socket.io";
import { Server } from "http";

interface IConnection {
    org: IOrganisation;
    socket: socketIo.Socket;
}

export class SocketIo {
    public io: socketIo.Server;
    public connections: IConnection[] = [];

    constructor(server: Server) {
        this.io = socketIo(server);
        this.initEvents();
    }

    public initEvents() {
        this.io.on("connection", async (socket: socketIo.Socket) => {

            console.log(`Device with id: ${socket.id} was connected`);

            socket.on("takeData", async (address: IAddress) => {

                console.log(`Device with id: ${socket.id} send data: lat - ${address.lat}, lng - ${address.lng}`);

                let minLength = Number.MAX_VALUE;
                let con: IConnection;

                for (const connection of this.connections) {

                    const organisation = connection.org;

                    const x1 = organisation.addressObj.lat;
                    const y1 = organisation.addressObj.lng;
                    const x2 = address.lat;
                    const y2 = address.lng;

                    const length = Math.sqrt((x1 ** 2 - x2 ** 2) + (y1 ** 2 - y2 ** 2));

                    if (minLength > length) {
                        minLength = length;
                        con = connection;
                    }
                }

                const data =
                    `https://www.google.com/maps/dir/${address.lat},${address.lng}//@${address.lat},${address.lng},15z`;

                console.log(data);
                if (con) {
                    socket.to(con.socket.id).emit("sendData", data);
                }
            });

            socket.on("disconnect", () => {
                this.connections = this.connections.filter((connection) => connection.socket.id !== socket.id);
            });

            socket.on("push", async () => {
                const org: IOrganisation
                    = (await OrganisationService.getOrganisationByToken(socket.handshake.query.token));

                this.connections.push({
                    org,
                    socket,
                });
            });
        });
    }
}
