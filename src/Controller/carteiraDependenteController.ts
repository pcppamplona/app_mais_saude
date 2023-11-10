import CarteiraDependente from "../Model/CarteiraDependente";

class carteiraDependenteController{
    static async buscarCarteirasDependentes(id_usuario:number){
        try{
            const carteiras = await CarteiraDependente.buscarCarteirasDependentes(id_usuario);
            return carteiras;
        }catch(error){
            throw error;
        }
    }

    static async cadastrarCarteiraDependentes(id_dependente:number){
        try{
            const carteira = new CarteiraDependente(id_dependente);
            carteira.cadastrarCarteiraDependentes(id_dependente);
        }catch(error){
            throw error;
        }
    }
}

export default carteiraDependenteController