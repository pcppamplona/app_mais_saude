import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import UsuarioController from "../../../Controller/UsuarioController";

export function ForgotPassScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Novo estado para controlar se o e-mail foi verificado
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodigoEditable, setIsCodigoEditable] = useState(false);
  const [textCodigo, setTextCodigo] = useState('Enviar Código')
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [isBtnCodigoDisabled, setIsBtnCodigoDisabled] = useState(true);
  const [isBtnPasswordDisabled, setIsBtnPasswordDisabled] = useState(true);
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [codigoEmail, setCodigoEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleVerificaEmail = async () => {
    console.log(email.length);
    if (email.length > 0) {
      const isEmailRegistered = await UsuarioController.verificarEmail(email);

      if (isEmailRegistered) {
        setIsEmailVerified(true); // Define isEmailVerified como verdadeiro se o e-mail estiver registrado
        setIsBtnCodigoDisabled(false);
        console.log(email)
      } else {
        alert('Email não cadastrado!');
      }
    }
  };

  const handleEnviarCodigo = async () => {
    if(textCodigo == 'Enviar Código'){
      setTextCodigo("Confirmar Código")
      setIsCodigoEditable(true);
      console.log(email)

      try{
        const codigo = await UsuarioController.CodigoAleatorio(email)

        if (codigo) {
          console.log("Código de verificação atual:", codigo);
          setCodigoEmail(codigo);
        } else {
          console.error("Código de verificação não recebido");
          setCodigoEmail('');
        }
      }catch(error){
        console.error("Erro ao enviar código:", error);
      }
    }else if(textCodigo == "Confirmar Código"){
      if(codigoDigitado == codigoEmail){
        console.log("Código está correto")
        setIsPasswordEditable(true);
        setIsBtnPasswordDisabled(false)
      }else if(codigoDigitado !== codigoEmail){
        alert("Código está INCORRETO!")
      }
    }
    
  }

  const handleAtualizarSenha = async () =>{
    if (newPassword.length > 5) {
      try {
        await UsuarioController.AtualizarSenha(email, newPassword);
        alert("Senha atualizada com sucesso!")
      } catch (error) {
        console.error("Erro ao atualizar senha:", error);
        // Trate o erro como desejar, exiba uma mensagem de erro, por exemplo.
      }
    } else {
      alert("Digite uma senha maior!");
    }
  }


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'red' }}>Esqueci minha senha</Text>
      <View>
          <TextInput
            placeholder="Digite seu email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TouchableOpacity
            style={{
              width: '80%',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2BB459',
              borderRadius: 30,
              marginBottom: 10,
              marginTop: 20,
            }}
            onPress={handleVerificaEmail}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Verificar Email
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center">
          <TextInput value={codigoDigitado}
            onChangeText={(text) => setCodigoDigitado(text)} placeholder="Digite o código" style={{ flex: 1 }} editable={isCodigoEditable}/>
          <TouchableOpacity style={{
              width: '30%',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2BB459',
              borderRadius: 30,
              marginBottom: 10,
              marginTop: 20,
            }}
            onPress={handleEnviarCodigo}
            disabled={isBtnCodigoDisabled}
            >
            <Text>{textCodigo}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center">
          <TextInput value={newPassword} onChangeText={(text) => setNewPassword(text)} placeholder="Digite uma nova senha" style={{ flex: 1 }} editable={isPasswordEditable}/>
          <TouchableOpacity style={{
              width: '30%',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2BB459',
              borderRadius: 30,
              marginBottom: 10,
              marginTop: 20,
            }}
            disabled={isBtnPasswordDisabled}
            onPress={handleAtualizarSenha}
            >
            <Text>Atualizar senha</Text>
          </TouchableOpacity>
        </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: '#9E9EA0', fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
}