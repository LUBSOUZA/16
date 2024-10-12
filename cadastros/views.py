from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.views.generic import TemplateView, ListView, CreateView
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404
from django.views.generic import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.views.generic import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import *
from .forms import *

#class PainelAnuncianteView(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
#    template_name = 'cadastros/painel_anunciante.html'
#    def test_func(self):
#        return hasattr(self.request.user, 'anuncianteprofile')
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import Vaga
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from .models import Vaga

class PainelAnuncianteView(LoginRequiredMixin, ListView):
    model = Vaga
    template_name = 'cadastros/painel_anunciante.html'
    context_object_name = 'vagas'
    
    def get_queryset(self):
        # Filtra as vagas criadas pelo anunciante logado
        return Vaga.objects.filter(usuario=self.request.user)

#class PainelAnuncianteView(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
#    template_name = 'cadastros/painel_anunciante.html'
#    
#    def test_func(self):
#        # Verifica se o usuário tem o perfil de anunciante
#        return hasattr(self.request.user, 'anuncianteprofile')
#
#    def get_context_data(self, **kwargs):
#        context = super().get_context_data(**kwargs)
#        
#        # Obtenha o perfil de anunciante
#        anunciante = self.request.user.anuncianteprofile
#        
#        # Buscar as empresas relacionadas às vagas desse anunciante
#        empresas = Vaga.objects.filter(anunciante=anunciante).values('empresa__id', 'empresa__nome').distinct()
#        
#        # Adicionar as empresas ao contexto para serem acessadas no template
#        context['empresas'] = empresas
#        
#        return context

class MapaVagas(TemplateView):
    template_name = 'cadastros/mapa.html'

class CriarVagaView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Vaga
    form_class = VagaForm
    template_name = 'cadastros/form_vaga.html'
    success_url = reverse_lazy('minhas_vagas')

    def test_func(self):
        return hasattr(self.request.user, 'anuncianteprofile')

    def form_valid(self, form):
        form.instance.usuario = self.request.user
        return super().form_valid(form)

class EditarVagaView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Vaga
    form_class = VagaForm
    template_name = 'cadastros/form_vaga.html'
    success_url = reverse_lazy('painel_anunciante')

    def test_func(self):
        # Verifica se o usuário é o criador da vaga (ou pode ser feito com base no perfil de anunciante)
        vaga = self.get_object()
        return vaga.usuario == self.request.user or hasattr(self.request.user, 'anuncianteprofile')

    def form_valid(self, form):
        # Mantém o usuário que criou a vaga inicialmente
        form.instance.usuario = self.request.user
        return super().form_valid(form)




class CriarEmpresaView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Empresa
    fields = ['nome', 'cnpj']
    template_name = 'cadastros/form_empresa.html'
    success_url = reverse_lazy('painel_anunciante')

    def test_func(self):
        return hasattr(self.request.user, 'anuncianteprofile')

class ListarVagasPorEmpresaView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    template_name = 'listar_vagas_empresa.html'
    context_object_name = 'vagas'

    def get_queryset(self):
        self.empresa = Empresa.objects.get(pk=self.kwargs['pk'])
        return Vaga.objects.filter(empresa=self.empresa)

    def test_func(self):
        return hasattr(self.request.user, 'anuncianteprofile')



class ListaTodasVagasView(ListView):
    model = Vaga
    template_name = 'cadastros/lista_todas_vagas.html'
    context_object_name = 'vagas'

    def get_queryset(self):
        # Retorna todas as vagas, apenas as que não estão inativas
        return Vaga.objects.filter(inativa=False)


class ListaVagasView(LoginRequiredMixin, ListView):
    model = Vaga
    template_name = 'cadastros/minhas_vagas.html'
    context_object_name = 'vagas'

    def get_queryset(self):
        # Retorna apenas as vagas criadas pelo usuário logado (anunciante)
        return Vaga.objects.filter(usuario=self.request.user)


class ExcluirVagaView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Vaga
    template_name = 'cadastros/confirmar_exclusao_vaga.html'
    success_url = reverse_lazy('minhas_vagas')

    def test_func(self):
        vaga = self.get_object()
        return vaga.usuario == self.request.user

##Views para listar cadastros
#class EmpresaList(LoginRequiredMixin, ListView):
#    login_url = reverse_lazy('login')
#    model = Empresa
#    template_name = 'cadastros/listas/empresa.html'
#
#class VagaList(LoginRequiredMixin, ListView):
#    login_url = reverse_lazy('login')
#    model = Vaga
#    template_name = 'cadastros/listas/vaga.html'
#
#    def get_queryset(self):
#        self.object_list = Vaga.objects.filter(usuario=self.request.user)
#        return self.object_list
#
#class AlunoList(ListView):
#    model = Vaga
#    template_name = 'cadastros/listas/aluno.html'
#
#class AnuncioList(ListView):
#    model = Vaga
#    fields = ['nome', 'descricao', 'link', 'empresa']
#    template_name = 'cadastros/form.html'
#
#

##Views para exclusão de cadastros
#
#class EmpresaDelete(GroupRequiredMixin, LoginRequiredMixin, DeleteView):
#    login_url = reverse_lazy('login')
#    group_required = u"Polo"
#    model = Empresa
#    template_name = 'cadastros/form-excluir.html'
#    success_url = reverse_lazy('listar-empresas')
#
#class VagaDelete(GroupRequiredMixin, LoginRequiredMixin, DeleteView):
#    login_url = reverse_lazy('login')
#    group_required = u"Polo"
#    model = Vaga
#    template_name = 'cadastros/form-excluir.html'
#    success_url = reverse_lazy('index')
#
#    def get_object(self, queryset=None):
#        #self.object = Vaga.objects.get(pk=self.kwargs['pk'], usuario=self.request.user)
#        self.object = get_object_or_404(Vaga, pk=self.kwargs['pk'], usuario=self.request.user)
#        return self.object
##Views para alteração de cadastros
#
#class EmpresaUpdate(LoginRequiredMixin, UpdateView):
#    login_url = reverse_lazy('login')
#    model = Empresa
#    fields = ['cnpj', 'nome']
#    template_name = 'cadastros/form.html'
#    success_url = reverse_lazy('listar-empresas')
#
#class VagaUpdate(LoginRequiredMixin, UpdateView):
#    login_url = reverse_lazy('login')
#    model = Vaga
#    fields = ['nome', 'descricao', 'link', 'inativa', 'empresa']
#    template_name = 'cadastros/form.html'
#    success_url = reverse_lazy('homepage')
#
#    def get_object(self, queryset=None):
#
#        #self.object = Vaga.objects.get(pk=self.kwargs['pk'], usuario=self.request.user)
#        self.object = get_object_or_404(Vaga, pk=self.kwargs['pk'], usuario=self.request.user)
#        return self.object
#
#    def get_context_data(self, *args, **kwargs):
#        context = super().get_context_data(*args, **kwargs)
#
#        context['titulo'] = "Atualizar Vaga"
#        return context
#
##
from django.http import JsonResponse
from django.views import View
from .models import Vaga

class VagaPointsView(View):
    def get(self, request, *args, **kwargs):
        # Filtra vagas com latitude e longitude preenchidas
        vagas = Vaga.objects.filter(latitude__isnull=False, longitude__isnull=False)
        
        # Formata os dados para o retorno JSON
        data = [
            {
                'nome': vaga.nome,
                'empresa': vaga.empresa.nome,
                'cep': vaga.cep,
                'latitude': vaga.latitude,
                'longitude': vaga.longitude
            } for vaga in vagas
        ]
        
        # Retorna os dados no formato JSON
        return JsonResponse(data, safe=False)
from django.views.generic import DetailView
from .models import Empresa

class EmpresaDetailView(DetailView):
    model = Empresa
    template_name = 'cadastros/detalhe_empresa.html'  # O template que será usado
    context_object_name = 'empresa'  # Nome que será usado no template para acessar a empresa
from django.views.generic import ListView
from .models import Empresa

class ListaEmpresasView(ListView):
    model = Empresa
    template_name = 'cadastros/lista_empresas.html'  # O template que será usado
    context_object_name = 'empresas'  # Nome da lista de empresas no template

