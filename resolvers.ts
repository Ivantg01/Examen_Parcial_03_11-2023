import { Request, Response } from "npm:express@4.18.2";
import AgendaModel from "./models.ts";


import { City } from "./types.ts";



export const getCiudad = async (codPostal:number,codPais:string): Promise<City> => {
    const BASE_URL = "https://zip-api.eu/api/v1";
    const url = `${BASE_URL}/info/${codPais}-${codPostal}`;
    const response = await fetch(url);
    if (response.status !== 200) {
        throw new Error("Cannot fetch location");
    }
    const data = await response.json();

    return {
        city: data.state
    };
};


export const getTodosContactos = async (req: Request, res: Response) => {
    try{
        const allContactos= await AgendaModel.find().exec(); // buscamos todos los discos sin filtros
        res.send(allContactos);
    }catch (error){
        res.status(500).send(error.message);
    }
    return;
}
//TERMINAR
export const getAnyContacto = async (req: Request, res: Response) => {
    try{
        const contacto= await AgendaModel.findOne({DNI: req.params.DNI}).exec();
        if(!contacto){
            res.status(404).send("No existe ese contacto")
            return;
        }
//        contacto.ciudad=await getCiudad(contacto.codigoPostal,contacto.codigoPais);
        res.send(contacto);
    }catch (error){
        res.status(500).send(error.message);
    }
    return;
}


export const addContacto = async (req: Request, res: Response) => {
    if(!req.body.DNI || !req.body.nombreApellido || !req.body.email || !req.body.codigoPostal || !req.body.codigoPais){
        res.status(500).send("Bad request: missing DNI, nombreApellido, email, codigoPostal or codigoPais");
        return;
    }
    try{
        const  contactoFound= await AgendaModel.findOne({name: req.body.DNI}).exec(); 
        if(contactoFound){
            res.status(400).send("Error: contacto with same DNI already exists");
            return;
        }
        const contacto= new AgendaModel(req.body);
        const result= await contacto.save();
        res.send(result);
    }catch (error){
        res.status(500).send(error.message);
    }
}

export const updateContacto = async (req: Request, res: Response) => {
    try{

        const contacto= await AgendaModel.findOneAndUpdate(req.params.id, req.body).exec();
        if(!req.body.DNI){
            res.send(contacto);
            return;
        }
        console.log(req.body.DNI)
        if(contacto.DNI!=req.body.DNI){
            res.send("You cant update DNI")
            return;
        }
        res.send(contacto);

    }catch (error){
        res.status(500).send(error.message);
    }
}

export const deleteContacto = async (req: Request, res: Response) => {
    try{
        const  contactoFound= await AgendaModel.findOne({DNI: req.params.DNI}).exec();
        if(!contactoFound){
            res.status(404).send("DNI no encontrado");
            return;
        }
        const contacto= await AgendaModel.findByIdAndDelete(contactoFound._id).exec();
        res.send(contacto);
    }catch (error){
        res.status(500).send(error.message);
    }
}





