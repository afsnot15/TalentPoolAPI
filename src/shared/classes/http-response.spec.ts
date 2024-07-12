import { EMensagem } from '../enums/mensagem.enum';
import { HttpResponse } from './http-response';

describe('HttpResponse', () => {
  it('deve cirar uma instancia com valores padrão', () => {
    const response = new HttpResponse(null);
    expect(response.data).toBeNull();
    expect(response.message).toBeUndefined();
    expect(response.count).toBeUndefined();
  });

  it('deve definir a mensagem Sucesso corretamente', () => {
    const successMessage = 'Sucesso';
    const response = new HttpResponse(null).onSuccess(successMessage);
    expect(response.message).toBe(successMessage);
  });

  it('deve definir a mensagem Salvo com sucesso corretamente', () => {
    const response = new HttpResponse(null).onCreated();
    expect(response.message).toBe(EMensagem.SalvoComSucesso);
  });

  it('deve definir a mensagem atualizado com sucesso corretamente', () => {
    const response = new HttpResponse(null).onUpdated();
    expect(response.message).toBe(EMensagem.AtualizadoSucesso);
  });

  it('deve definir a mensagem excluída corretamente', () => {
    const response = new HttpResponse(null).onDeleted();
    expect(response.message).toBe(EMensagem.ExcluidoSucesso);
  });
});
