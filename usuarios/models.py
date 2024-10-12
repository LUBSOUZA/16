from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
# Validação de CPF
def validate_cpf(value):
    if len(value) != 11 or not value.isdigit():
        raise ValidationError('CPF deve ter 11 dígitos.')

# Lista de cursos da UNIVESP
CURSOS_UNIVESP = [
    ('', 'Selecione seu curso'),
    ('ENG_COMP', 'Engenharia de Computação'),
    ('ENG_PROD', 'Engenharia de Produção'),
    ('C_DADOS', 'Ciência de Dados'),
    ('TEC_INFO', 'Tecnologia da Informação'),
    ('MAT', 'Licenciatura em Matemática'),
    ('PED', 'Licenciatura em Pedagogia'),
    ('LET', 'Licenciatura em Letras'),
]
INSTITUICOES_OPCOES = [
    ('', 'Selececione sua Instituição'),
    ('UNIVESP', 'Univesp'),
    ('OUTRA', 'Outra Instituição'),
]
SITUACAO_DO_CURSO = [
    ('', 'Situação do Curso'),
    ('CONCLUÍDO', 'Concluído'),
    ('EM ANDAMENTO', 'Em andamento'),
]
class AlunoProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100)
    instituicao = models.CharField(max_length=100, choices=INSTITUICOES_OPCOES)

    is_formado = models.CharField(max_length=100, choices=SITUACAO_DO_CURSO, blank=True, null=True)

    # Campos para "Outra"
    outra_instituicao = models.CharField(max_length=100, blank=True, null=True)
    outro_curso = models.CharField(max_length=100, blank=True, null=True)

#    cpf = models.CharField(max_length=11, validators=[validate_cpf], verbose_name="CPF")
    curso = models.CharField(max_length=100, choices=CURSOS_UNIVESP, blank=True, null=True)
    semestre = models.PositiveIntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(20)], verbose_name="Semestre")
    telefone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return "{} {}".format(self.nome, self.cpf)

class AnuncianteProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100, verbose_name="Nome da Empresa")
    instituicao = models.CharField(max_length=100, verbose_name="Instituição")
#    cpf = models.CharField(max_length=11, validators=[validate_cpf], verbose_name="CPF")
    cargo = models.CharField(max_length=100)
    telefone = models.CharField(max_length=15, null=True, blank=True)

#    def __str__(self):
#        return self.user.username
    def __str__(self):
        return "{} ({})".format(self.nome, self.cnpf)

