import Usuario from "../Model/Usuário";
import EmailController from "./EmailController"

class UsuarioController{
    static cadastrarUsuario(email: string, senha: string,nome_completo: string,cpf: string,data_nascimento: string,sexo: string) {
      //const dataNascimentoParts = data_nascimento.split('-');
      //const dataNascimentoFormatted = `${dataNascimentoParts[2]}-${dataNascimentoParts[1]}-${dataNascimentoParts[0]}`;  
      const usuario = new Usuario(email, senha, nome_completo, cpf, data_nascimento, sexo);
      usuario.cadastro(email, senha, nome_completo, cpf, data_nascimento, sexo); // Chama diretamente o método post() do modelo User
    }

    static async verificarEmail(email: string): Promise<boolean> {
      try {
        // Chama o método estático de verificação de email em Usuario.ts
        return await Usuario.verificarEmail(email);
      } catch (error) {
        console.error('Erro ao verificar email no controlador:', error);
        return false; // Retorna false em caso de erro
      }
    }

    static async loginUsuario(email: string, senha: string): Promise<number | null> {
        const userId = await Usuario.login(email, senha);
    
        if (userId !== null) {
          // Login bem-sucedido, faça o que você precisa com o ID do usuário
          // Por exemplo, você pode armazenar o ID do usuário no estado ou contexto
          // e navegar para a próxima tela (por exemplo, "Tabs")
          console.log("Login bem-sucedido, ID do usuário:", userId);
          // Implemente a navegação para a próxima tela aqui
          console.log("Id vindo do controller",userId)
          return userId;
        } else {
          // Trate o erro de login aqui
          console.error("Falha no login");
        }
      }

      static async getUsuarioPorId(idUsuario: number) {
        try {
          const usuarioInfo = await Usuario.getUsuarioPorId(idUsuario);
          console.log("vai retornar do controller")
          return usuarioInfo;
        } catch (error) {
          console.error('Erro ao buscar informações do usuário no controlador:', error);
          return null;
        }
      }

      static async atualizarPerfil(idUsuario: number, data: any) {
        try {
          // Chame o método para atualizar no banco, passando o ID e os dados
          await Usuario.atualizarPerfilNoBanco(idUsuario, data);
    
          console.log("Perfil atualizado com sucesso no controlador");
        } catch (error) {
          console.error("Erro ao atualizar perfil no controlador:", error);
          throw error;
        }
      }

      static async ExcluirConta(idUsuario: number, senha: string){
        try{
            await Usuario.ExcluirConta(idUsuario, senha)
        }catch(error){
          console.error("Erro ao excluir conta:", error);
          throw error;
        }
      }
      


      static async CodigoAleatorio(email: string): Promise<string | null> {
        try{
          console.log("Email passado: ", email)
          const codigo = await EmailController.EnviarCodigo(email)
          console.log("Codigo no controller: "+codigo)
          return codigo
        }catch(error){
          console.error("Erro ao enviar o Email:", error)
          throw error
        }
      }


      static async AtualizarSenha(email:string, senha: string): Promise<void>{
        try {
          await Usuario.AtualizarSenha(email, senha);
        } catch (error) {
          throw error;
        }
      }

      static async verificarSenha(id:number, senha:string): Promise<boolean>{
        try {
          return await Usuario.verificarSenha(id, senha);
        } catch (error) {
          console.error('Erro ao verificar senha no controlador:', error);
          return false;
        }
      }

      static async AtualizarNovaSenha(id:number, novaSenha: string){
        try{
          await Usuario.AtualizarNovaSenha(id, novaSenha)
        }catch(error){
          console.error('Erro ao atualizar nova senha no controlador:', error);
        }
      }
}

export default UsuarioController;