import mongoose from 'npm:mongoose@7.6.3';

const Schema = mongoose.Schema;

type AgendaPeq ={
    DNI: string,
    nombreApellido:string,
}

type Agenda = {
    DNI: string,
    nombreApellido: string,
    email: string,
    codigoPostal: number,
    codigoPais:string,
    id: string,
    ciudad?:string,
    pais?:string,


}

const agendaSchema = new Schema(
    {
        DNI: String,
        nombreApellido: String,
        email: String,
        codigoPostal: Number,
        codigoPais: String,
        ciudad:String,
        //no incluimos id ya que mongoDB crea un campo _id automaticamente
    },
    { timestamps: true }
);

export type AgendaModelType = mongoose.Document & Omit<Agenda, "id">;


export default mongoose.model<AgendaModelType>("Agenda", agendaSchema);