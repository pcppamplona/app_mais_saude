import VacinaDependete from "../Model/VacinaDependente";

class vacinaDependenteController{
    static async buscarVacinaDependente(id_carteiraDependente:number){
        try{
            const vacinasDependente = await VacinaDependete.buscarVacinaDependente(id_carteiraDependente)
            return vacinasDependente;
        }catch(error){
            throw error;
        }
    }

    static async cadastrarVacinaDependentes(id_carteiraDependente:number, Nome_Vacina:string, Local_Vacinacao: string,Data_Vacinacao: string,Dose: number){
        try{
            const vacinadependente = new VacinaDependete(id_carteiraDependente, Nome_Vacina, Local_Vacinacao, Data_Vacinacao, Dose)
            vacinadependente.cadastrarVacinaDependente(id_carteiraDependente, Nome_Vacina, Local_Vacinacao, Data_Vacinacao, Dose)
        }catch(error){
            throw error;
        }
    }

    static async editarVacinaDependente(id_carteiraDependente:number,id_vacinaDependente:number, Nome_Vacina:string, Local_Vacinacao: string,Data_Vacinacao: string,Dose: number){
        try{
            VacinaDependete.editarVacinaDependente(id_carteiraDependente, id_vacinaDependente, Nome_Vacina, Local_Vacinacao, Data_Vacinacao, Dose)
        }catch(error){
            throw error
        }
    }

    static async excluirVacinaDependente(id_carteiraDependente:number,id_vacinaDependente:number){
        try{
            VacinaDependete.excluirVacinaDependente(id_carteiraDependente, id_vacinaDependente)
        }catch(error){
            throw error
        }
    }
}