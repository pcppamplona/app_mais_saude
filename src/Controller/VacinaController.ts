import Vacina from "../Model/Vacina";

class VacinaController{
    static async buscarVacina(id_carteira:number){
        try{
            const vacinas = await Vacina.buscarVacina(id_carteira)
            return vacinas;
        }catch(error){
            throw error;
        }
    }

    static async cadastrarVacina(id_carteira:number, Nome_Vacina:string, Local_Vacinacao: string,Data_Vacinacao: string,Dose: number){
        try{
            const vacina = new Vacina(id_carteira, Nome_Vacina, Local_Vacinacao, Data_Vacinacao, Dose)
            console.log("No controller:"+id_carteira+Nome_Vacina+Local_Vacinacao+Data_Vacinacao+Dose)
            vacina.cadastrarVacina(id_carteira, Nome_Vacina, Local_Vacinacao, Data_Vacinacao, Dose)
        }catch(error){
            throw error;
        }
    }

    static async editarVacina(id_carteira:number,id_vacina:number, Nome_Vacina:string, Local_Vacinacao: string,Data_Vacinacao: string,Dose: number){
        try{
            Vacina.editarVacina(id_carteira, id_vacina, Nome_Vacina, Local_Vacinacao, Data_Vacinacao, Dose)
        }catch(error){
            throw error
        }
    }

    static async excluirVacina(id_carteira:number,id_vacina:number){
        try{
            Vacina.excluirVacina(id_carteira, id_vacina)
        }catch(error){
            throw error
        }
    }
}

export default VacinaController;