from django.db import models
from django.contrib.auth.models import User
from usuarios.models import *

class Empresa(models.Model):
    cnpj = models.CharField(max_length=255, unique=True, verbose_name="CNPJ")
    nome = models.CharField(max_length=255, verbose_name="Nome da empresa")

    def __str__(self):
        return f"{self.nome} ({self.cnpj})"
from django.contrib.gis.db import models as gis_models
from geopy.geocoders import Nominatim
import brazilcep
from django.contrib.gis.geos import Point

class Vaga(models.Model):
    nome = models.CharField(max_length=255)
#    descricao = models.TextField(verbose_name="Descrição")
    descricao = models.TextField()  # Campo para usar com o CKEditor
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    link = models.URLField(blank=True)
    inativa = models.BooleanField(default=False)
    usuario = models.ForeignKey(User, on_delete=models.PROTECT)
    cep = models.CharField(max_length=10, verbose_name="CEP")
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    geom = gis_models.PointField(geography=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Geocodificar o CEP e obter latitude e longitude se não estiverem definidos
        if not self.latitude or not self.longitude:
            self.latitude, self.longitude = self.obter_latitude_longitude(self.cep)
            if self.latitude and self.longitude:
                self.geom = Point(self.longitude, self.latitude)
        
        super().save(*args, **kwargs)

    def obter_latitude_longitude(self, cep):
        # Função para obter a latitude e longitude usando brazilcep e geopy
        endereco = brazilcep.get_address_from_cep(cep)

        if 'street' in endereco and 'city' in endereco and 'district' in endereco:
            endereco_completo = f"{endereco['street']}, {endereco['district']}, {endereco['city']} - {endereco['uf']}"
            
            geolocator = Nominatim(user_agent="test_app")
            location = geolocator.geocode(endereco_completo)

            if location:
                return location.latitude, location.longitude
            else:
                print("Nenhuma localização encontrada para o endereço.")
                return None, None
        else:
            print("Informações insuficientes para formar o endereço completo.")
            return None, None

