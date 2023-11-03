import emailjs from '@emailjs/browser'
import axios, { AxiosResponse } from "axios";
import { supabaseApiKey } from '../Model/services/supabaseApiKey';

class EmailController{
  
  static async RecuperarNomeEmail(email: string){
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
      if (data.length === 1) {
        // O email foi encontrado, retorna o Nome_Completo do usuário
        const nomeCompleto = data[0].Nome_Completo;
        return nomeCompleto;
      } else {
        console.error('Email não encontrado');
        return null;
      }
    } catch (error) {
      console.error('Erro ao recuperar o Nome_Completo:', error);
      return null;
    }
  }
  
  static async gerarCodigoAleatorio(): Promise<string> {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';

    for (let i = 0; i < 5; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(indiceAleatorio);
    }

    return codigo;
  }

  static async EnviarCodigo(email: string): Promise<string | null>{        
      const nomeCompleto = await EmailController.RecuperarNomeEmail(email);
      const codigo = await EmailController.gerarCodigoAleatorio();
    
      console.log(codigo)
        const templateParams = {
            to_email: email,
            to_name: nomeCompleto,
            from_name: '+Saúde',
            message: 'Código de verificação:'+codigo,
          };

          console.log("No email controller:", email)
          
          emailjs
            .send('service_ae9bl8k', 'template_u2iminb', templateParams, 'fkWNEwBosns4y4Eoz')
            .then((response) => {
              console.log('Email enviado com sucesso:', response);
            })
            .catch((error) => {
              console.error('Erro ao enviar email:', error);
            });
            
          return codigo;
    }
}

export default EmailController;