from django import forms
from .models import Vaga, Empresa
from django_ckeditor_5.widgets import CKEditor5Widget
class VagaForm(forms.ModelForm):
    class Meta:
        model = Vaga
        fields = ['nome', 'descricao', 'empresa', 'link', 'inativa', 'cep']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Preenchendo o campo empresa com empresas já cadastradas
        empresas = Empresa.objects.all()
        empresa_choices = [(empresa.id, empresa.nome) for empresa in empresas]
        empresa_choices.insert(0, ('', 'Selecione uma empresa'))
        self.fields['empresa'].choices = empresa_choices
        # Adicionando placeholders e removendo labels
        self.fields['nome'].widget.attrs.update({'placeholder': 'Título da Vaga'})
#        self.fields['descricao'].widget.attrs.update({'placeholder': 'Descrição da Vaga'})
        self.fields['empresa'].widget.attrs.update({'placeholder': 'Selecione uma empresa'})
        self.fields['link'].widget.attrs.update({'placeholder': 'Link para a Vaga (opcional)'})
        self.fields['inativa'].widget.attrs.update({'placeholder': 'Vaga inativa'})
        self.fields['cep'].widget.attrs.update({'placeholder': 'Vaga cep'})
        # Adicionando o CKEditor 5 no campo 'descricao'
        self.fields['descricao'].widget = CKEditor5Widget(
            config_name='default'
        )

        # Remover os labels
        for field in self.fields:
            self.fields[field].label = ''

    def clean(self):
        cleaned_data = super().clean()
        empresa = cleaned_data.get('empresa')

        # Verifica se uma empresa foi selecionada
        if not empresa:
            raise forms.ValidationError("Você deve selecionar uma empresa.")

        return cleaned_data


class EmpresaForm(forms.ModelForm):
    class Meta:
        model = Empresa
        fields = ['nome', 'cnpj']
        widgets = {
            'cnpj': forms.TextInput(attrs={'placeholder': 'CNPJ da Empresa'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nome'].widget.attrs.update({'placeholder': 'Nome da Empresa'})
        self.fields['cnpj'].widget.attrs.update({'placeholder': 'CNPJ da Empresa'})

    def clean_cnpj(self):
        cnpj = self.cleaned_data.get('cnpj')
        # Adicione validações para CNPJ aqui, se necessário
        return cnpj

