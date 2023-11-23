import axios, { AxiosResponse } from "axios";
import supabase from "./services/supabase";
import { supabaseApiKey } from "./services/supabaseApiKey";
import UsuarioController from "../Controller/UsuarioController";




class Usuario{
    Email: string;
    Senha: string;
    Nome_Completo: string;
    CPF: string;
    Data_Nascimento: string;
    Sexo: string;

    constructor(Email: string, Senha: string, Nome_Completo: string, CPF: string, Data_Nascimento: string, Sexo: string){
        this.Email = Email;
        this.Senha = Senha;
        this.Nome_Completo = Nome_Completo;
        this.CPF = CPF;
        this.Data_Nascimento = Data_Nascimento;
        this.Sexo = Sexo;
    }
    async cadastro(
        email: string,
        senha: string,
        nome_completo: string,
        cpf: string,
        data_nascimento: string,
        sexo: string
    ) {
        try {
            const response = await supabase.post(
                `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário`, // Substitua "seu-tabela" pelo nome da tabela que você deseja inserir os dados
                {
                    Email: email,
                    Senha: senha,
                    Nome_Completo: nome_completo,
                    CPF: cpf,
                    Data_Nascimento: data_nascimento,
                    Sexo: sexo
                },
                {
                    headers: {
                        'apikey': supabaseApiKey,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Dados inseridos com sucesso:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao inserir dados:', error);
            throw error;
        }
    }

    static async login(email: string, senha: string): Promise<number | null> {
        try {
          const response = await axios.get(
            `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?Email=eq.${email}&Senha=eq.${senha}`,
            {
              headers: {
                'apikey': supabaseApiKey,
              },
            }
          );
    
          const data = response.data;
          if (data.length === 1) {
            // Login bem-sucedido, retorna o ID do usuário
            return data[0].id_usuario;
          } else {
            console.error('Credenciais inválidas');
            return null;
          }
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          return null;
        }
      }


      static async verificarEmail(email: string): Promise<boolean> {
        try {
          const response = await axios.get(
            `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?Email=eq.${email}`,
            {
              headers: {
                'apikey': supabaseApiKey,
              },
            }
          );
    
          const data = response.data;
          return data.length > 0; // Se houver dados, o email já está cadastrado
        } catch (error) {
          console.error('Erro ao verificar email:', error);
          return false; // Retorna false em caso de erro
        }
      }


      static async getUsuarioPorId(idUsuario: number) {
        try {
          const response = await axios.get(
            `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?id_usuario=eq.${idUsuario}`,
            {
              headers: {
                'apikey': supabaseApiKey,
              },
            }
          );
      
          const data = response.data;
          if (data.length === 1) {
            // Retorna os dados do usuário encontrado
            console.log("vai retornar do método")
            return data[0];
          } else {
            console.error('Usuário não encontrado');
            return null;
          }
        } catch (error) {
          console.error('Erro ao buscar informações do usuário:', error);
          return null;
        }
      }
      
      static async atualizarPerfilNoBanco(idUsuario: number, data: any) {
        try {
          // Construa a URL correta para atualizar o perfil do usuário
          const url = `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?id_usuario=eq.${idUsuario}`;
    
          // Faça uma solicitação PATCH para atualizar o perfil
          const response = await axios.patch(url, {
            Nome_Completo: data.Nome_Completo,
            Email: data.Email,
            CPF: data.CPF,
            Data_Nascimento: data.Data_Nascimento,
            Sexo: data.Sexo,
          }, {
            headers: {
              'apikey': supabaseApiKey,
            },
          });
    
          console.log("Perfil atualizado com sucesso:", response.data);
        } catch (error) {
          console.error("Erro ao atualizar perfil:", error);
          throw error;
        }
      }

      static async ExcluirConta(idUsuario: number, senha: string) {
        try {
          // Verifique a senha diretamente no banco de dados usando a URL do Supabase
          const response = await axios.get(`https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?id_usuario=eq.${idUsuario}&Senha=eq.${senha}`, {
            headers: {
              'apikey': supabaseApiKey,
            },
          });
    
          const usuarios = response.data;
    
          // Verifique se há um usuário com o ID e senha especificados
          if (usuarios.length === 1) {
            // Exclua a conta com uma solicitação DELETE
            await axios.delete(`https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?id_usuario=eq.${idUsuario}`, {
              headers: {
                'apikey': supabaseApiKey,
              },
            });
    
            console.log('Conta excluída com sucesso.');
          } else {
            console.log('Senha incorreta.');
          }
        } catch (error) {
          console.error('Erro ao verificar senha e excluir conta:', error);
          throw error;
        }
      }

      static async AtualizarSenha(email:string, senha: string){
        try {
          console.log("Email no AtualizarSenha:"+email)
          const searchResponse = await axios.get(
            `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?Email=eq.${email}`,
            {
              headers: {
                'apikey': supabaseApiKey,
              },
            }
          );
      
          const userData = searchResponse.data;
          console.log("Dados retornados:", userData);
      
          if (userData.length === 1) {
            console.log("Achou um usuário com o email")
            const userId = userData[0].id_usuario;
      
            try {
              const updateResponse = await axios.patch(
                `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?id_usuario=eq.${userId}`,
                {
                  Senha: senha,
                },
                {
                  headers: {
                    'apikey': supabaseApiKey,
                  },
                }
              );
      
              console.log("Senha atualizada com sucesso:", updateResponse.data);
            } catch (updateError) {
              console.error("Erro ao atualizar senha:", updateError);
              throw updateError;
            }
          } else {
            console.error('Email não encontrado');
          }
        } catch (error) {
          console.error("Erro na solicitação de pesquisa:", error);
          throw error;
        }
      }

      static async verificarSenha(id:number, senha:string ): Promise<boolean>{
        try {
          const response = await axios.get(
            `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?id_usuario=eq.${id}&Senha=eq.${senha}`,
            {
              headers: {
                'apikey': supabaseApiKey,
              },
            }
          );
    
          const data = response.data;
          if(data.length > 0){
            return true;
          } // Se houver dados, o email já está cadastrado
        } catch (error) {
          console.error('Erro ao verificar senha:', error);
          return false; // Retorna false em caso de erro
        }
      }

      static async AtualizarNovaSenha(id:number, novaSenha: string){
        try{
          const updateResponse = await axios.patch(
            `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Usuário?id_usuario=eq.${id}`,
            {
              Senha: novaSenha,
            },
            {
              headers: {
                'apikey': supabaseApiKey,
              },
            }
          );
  
          console.log("Senha atualizada com sucesso:", updateResponse.data);
        }catch(error){
          console.error("Erro ao atualizar senha:", error);
          throw error;
        }
      }
}

export default Usuario;