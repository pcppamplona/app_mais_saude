import axios, { AxiosResponse } from "axios";
import supabase from "./services/supabase";
import { supabaseApiKey } from "./services/supabaseApiKey";

class Remedio{
    id_usuario:number;
    Nome_Remedio:string;
    Horario_Inicial:string;
    Quantidade_Dias:number;
    Frequencia:string;
    Doses_Atrasadas:number;
    Qntd_DosesRestantes:number;
    Qntd_Total:number;
    Data_Final:Date;
    Status:Boolean;

    constructor(id_usuario:number,Nome_Remedio:string,Horario_Inicial:string,Quantidade_Dias:number,Frequencia:string,Doses_Atrasadas:number,Qntd_DosesRestantes:number,Qntd_Total:number,Data_Final:string,Status:Boolean){
        this.id_usuario = id_usuario;
        this.Nome_Remedio = Nome_Remedio;
        this.Horario_Inicial = Horario_Inicial;
        this.Quantidade_Dias = Quantidade_Dias;
        this.Frequencia = Frequencia;
        this.Doses_Atrasadas = Doses_Atrasadas;
        this.Qntd_DosesRestantes = Qntd_DosesRestantes;
        this.Qntd_Total = Qntd_Total;
        this.Data_Final = new Date(Data_Final);
        this.Status = Status;
    }

    static async BuscarRemedios(id_usuario:number){
        try {
            const response = await axios.get(
              `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Remedio?id_usuario=eq.${id_usuario}`,
              {
                headers: {
                  'apikey': supabaseApiKey,
                },
              }
            );
        
            const data = response.data;
            return data;
          } catch (error) {
            throw error;
          }
    }

    async cadastrarRemedio(
      id_usuario:number,Nome_Remedio:string,Horario_Inicial:string,Quantidade_Dias:number,Frequencia:string,Doses_Atrasadas:number,Qntd_DosesRestantes:number,Qntd_Total:number,Data_Final:string,Status:Boolean
  ) {
      try {
          const response = await supabase.post(
              `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Remedio`, // Substitua "seu-tabela" pelo nome da tabela que você deseja inserir os dados
              {
                  id_usuario:id_usuario,
                  Nome_Remedio: Nome_Remedio,
                  Horario_Inicial: Horario_Inicial,
                  Quantidade_Dias: Quantidade_Dias,
                  Frequencia: Frequencia,
                  Doses_Atrasadas: Doses_Atrasadas,
                  Qntd_DosesRestantes:Qntd_DosesRestantes,
                  Qntd_Total:Qntd_Total,
                  Data_Final: new Date(Data_Final),
                  Status: Status
              },
              {
                  headers: {
                      'apikey': supabaseApiKey,
                      'Content-Type': 'application/json',
                  },
              }
          );

          console.log('Dados do remédio inseridos com sucesso:', response.data);
          // Agora, faça uma consulta para obter o ID do último registro inserido
      } catch (error) {
          console.error('Erro ao inserir dados do remédio:', error);
          throw error;
      }
  }

  static async BuscarRemedioId(id_remedio:number){
    try {
        const response = await axios.get(
          `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Remedio?id_remedio=eq.${id_remedio}`,
          {
            headers: {
              'apikey': supabaseApiKey,
            },
          }
        );
    
        const data = response.data;
        return data;
      } catch (error) {
        throw error;
      }
}

    static async editarRemedio(id_usuario:number, id_remedio: number, Nome_Remedio: string, Horario_Inicial:string, Quantidade_Dias:number, Frequencia:string, Doses_Atrasadas:number,     Qntd_DosesRestantes:number, Qntd_Total:number, Data_Final:string, Status:boolean) {
      try {
        // Construa a URL correta para atualizar o perfil do usuário
      
        // Faça uma solicitação PATCH para atualizar o perfil
        const response = await supabase.patch(
          `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Remedio?id_remedio=eq.${id_remedio}&id_usuario=eq.${id_usuario}`,
          {
          Nome_Remedio: Nome_Remedio,
          Horario_Inicial: Horario_Inicial,
          Quantidade_Dias: Quantidade_Dias,
          Frequencia: Frequencia,
          Doses_Atrasadas: Doses_Atrasadas,
          Qntd_DosesRestantes: Qntd_DosesRestantes,
          Qntd_Total: Qntd_Total,
          Data_Final: new Date(Data_Final),
          Status: Status
        }, {
          headers: {
            'apikey': supabaseApiKey,
            'Content-Type': 'application/json'
          },
        });
      
        console.log("Remédio atualizado com sucesso:", response.data);
      } catch (error) {
        console.error("Erro ao atualizar remédio:", error);
        throw error;
      }
    }


    static async excluirRemedio(id_usuario:number, id_remedio: number) {
      try {
        const response = await supabase.delete(
          `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Remedio?id_remedio=eq.${id_remedio}&id_usuario=eq.${id_usuario}`,
          {
          headers: {
            'apikey': supabaseApiKey,
            'Content-Type': 'application/json'
          },
        });
      
        console.log("Remédio excluído com sucesso:", response.data);
      } catch (error) {
        console.error("Erro ao excluir remédio:", error);
        throw error;
      }
    }

    static async BuscarUltimoRemedio(){
      try{
        const queryResponse = await supabase.get(
          `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Remedio?select=id_remedio,Nome_Remedio,Horario_Inicial,Frequencia,Qntd_Total&order=id_remedio.desc&limit=1`,
          {
            headers: {
              'apikey': supabaseApiKey,
            },
          }
        );
        
        // Verifique se a consulta retornou algum resultado
        if (queryResponse.data.length > 0) {
          const remedioData = queryResponse.data[0];
          console.log('Dados do remédio inserido:', remedioData);
          return remedioData;
        } else {
          console.error('Nenhum registro encontrado após a inserção.');
          return null;
        }
      }catch(error){
        console.error("Erro na busca")
      }
    }

    static async atualizarQntdDosesRestantes(idRemedio, valor) {
      try {
        // Passo 1: Fazer uma consulta para obter o registro específico do remédio
        const response = await axios.get(
          `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Remedio?id_remedio=eq.${idRemedio}`,
          {
            headers: {
              'apikey': supabaseApiKey,
            },
          }
        );
    
        const remedioData = response.data[0];
    
        // Verificar se o remédio foi encontrado
        if (remedioData) {
          // Passo 2: Obter o valor atual de Qntd_DosesRestantes
          let qntdDosesRestantes = remedioData.Qntd_DosesRestantes;
    
          // Passo 3: Subtrair o valor passado como parâmetro
          console.log("Antes:"+qntdDosesRestantes)
          qntdDosesRestantes = qntdDosesRestantes - valor;
          console.log("Depois:"+qntdDosesRestantes)
    
          // Passo 4: Se o resultado for igual a 0, atualize o campo Status como true
          const status = qntdDosesRestantes === 0;
    
          // Passo 5: Atualize o banco de dados com os novos valores
          const patchResponse = await axios.patch(
            `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Remedio?id_remedio=eq.${idRemedio}`,
            {
              Qntd_DosesRestantes: qntdDosesRestantes,
              Status: status,
            },
            {
              headers: {
                'apikey': supabaseApiKey,
                'Content-Type': 'application/json',
              },
            }
          );
    
          return patchResponse.data;
        } else {
          console.error('Remédio não encontrado.');
          return null;
        }
      } catch (error) {
        console.error('Erro ao atualizar Qntd_DosesRestantes:', error);
        throw error;
      }
    }

    
}

export default Remedio;