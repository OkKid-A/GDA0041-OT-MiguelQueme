import {StatusEnum} from "../../entities/StatusEnum.ts";

const parseOrderStatus = (id_estado: StatusEnum) => {
    switch (id_estado) {
        case StatusEnum.ACTIVE:
            return "Entregada";
        case StatusEnum.PENDING:
            return "Pendiente";
        case StatusEnum.REJECTED:
            return "Rechazada";
        case StatusEnum.CANCELED:
            return "Cancelada";
        default:
            return "Borrada";
    }
};

export default parseOrderStatus;