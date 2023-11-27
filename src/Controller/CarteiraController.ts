import Carteira from "../Model/Carteira";

class CarteiraController{
    static async buscarCarteira(id_usuario:number){
        try{
            const carteira = await Carteira.buscarCarteira(id_usuario)
            return carteira;
        }catch(error){
            throw error;
        }
    }

    static async cadastrarCarteira(id_usuario:number){
        try{
            const carteira = new Carteira(id_usuario);
            carteira.cadastrarCarteira(id_usuario);
        }catch(error){
            throw error;
        }
    }
}

export default CarteiraController;