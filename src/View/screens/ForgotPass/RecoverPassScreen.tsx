import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { usuarioSessao } from "../LoginScreen";
import UsuarioController from "../../../Controller/UsuarioController";


export function RecoverPassScreen({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novaSenhaEditable, setNovaSenhaEditable] = useState(false);
  const [btnNovaDisabled, setBtnNovaDisabled] = useState(true);
  const id_usuario = usuarioSessao;

  const handleVericarSenha = async () =>{
    try{
      const senha = await UsuarioController.verificarSenha(id_usuario, senhaAtual);

      if (senha) {
        alert("Senha encontrada!");
        setNovaSenhaEditable(true);
        setBtnNovaDisabled(false);
      } else {
        alert("Senha inválida!");
        setNovaSenhaEditable(false);
        setBtnNovaDisabled(true);
      }
    }catch(error){
      console.error("Erro:", error);
    }
  }

  const handleAtualizarSenha = async () =>{
    if(novaSenha.length < 5){
      alert("Digite uma senha maior");
    }else if(novaSenha.length > 5){
      try{
        await UsuarioController.AtualizarNovaSenha(id_usuario, novaSenha);
        alert("Senha atualizada");
      }catch(error){
        console.error("Erro:", error);
        alert(error);
      }
    }
  }


  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-red-700">Atualizar Senha</Text>

      <View>
          <TextInput
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChangeText={(text) => setSenhaAtual(text)}
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
            onPress={handleVericarSenha}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Verificar Senha
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            placeholder="Digite uma nova senha"
            value={novaSenha}
            onChangeText={(text) => setNovaSenha(text)}
            editable={novaSenhaEditable}
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
            onPress={handleAtualizarSenha}
            disabled={btnNovaDisabled}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Atualizar Senha
            </Text>
          </TouchableOpacity>
        </View>

      <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
        <Text style={{ color: '#9E9EA0', fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
    
  );
}
