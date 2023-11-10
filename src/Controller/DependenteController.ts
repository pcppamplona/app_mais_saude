import Dependente from "../Model/Dependente";

class DependenteController{
    static async buscarDependentes(id_usuario:number){
        try{
            const dependentes = await Dependente.buscarDependentes(id_usuario);
            return dependentes;
        }catch(error){
            throw error;
        }
    }

    static async cadastrarDependentes(id_usuario:number, Nome_Completo: string, Data_Nascimento: string, Sexo: string){
        const dataNascimentoParts = Data_Nascimento.split('-');
        const dataNascimentoFormatted = `${dataNascimentoParts[2]}-${dataNascimentoParts[1]}-${dataNascimentoParts[0]}`; 
        const dependente = new Dependente(id_usuario, Nome_Completo, dataNascimentoFormatted, Sexo);
        dependente.cadastrarDependente(id_usuario, Nome_Completo, dataNascimentoFormatted, Sexo);
    }

    static async buscarDependenteId(id_dependente:number){
        try{
            const dependente = Dependente.buscarDependenteId(id_dependente);
            return dependente;
        }catch(error){
            throw error;
        }
    }

    static async editarDependente(id_usuario:number, id_dependente:number, Nome_Completo: string, Data_Nascimento: string, Sexo: string){
        try{
            Dependente.editarDependente(id_usuario, id_dependente, Nome_Completo, Data_Nascimento, Sexo);
        }catch(error){
            throw error;
        }
    }

    static async excluirDependente(id_usuario:number, id_dependente: number){
        try{
            Dependente.excluirDependente(id_usuario,id_dependente)
        }catch(error){
            console.log("Dependente excluído!")
        }
    }
}