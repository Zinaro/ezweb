
<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="toggleNavbar">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
      
    </div>
    <div class="navbar-menu" :class="{ 'is-active': navbarOpen }">
      <div class="navbar-start">
        <a class="navbar-item button" @click="$router.push('/')">Home</a>
        <a class="navbar-item button" @click="$router.push('/about')">About</a>
        <a v-if="user" class="navbar-item button" @click="$router.push('/users')">Users</a>
        <div v-if="user" class="navbar-item button">
          Bi xer hati,<a v-if="user" class="navbar-item button" @click="$router.push('/@'+ user.username)"> {{ user.name }}
        </a>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item button">
            <a v-if="!user" class="button button" @click="$router.push('/signup')">Sign up</a>
            <a v-if="!user" class="button button" @click="$router.push('/login')">Login</a>
            <button v-if="user" class="button button" @click.prevent="logout">Log out</button>
        </div>
      </div>
    </div>
  </nav>

  <router-view />
</template>

<script>
import VueCookies from 'vue-cookies'

export default {
  name: 'App',
  data() {
    return {
      navbarOpen: false,
      user: VueCookies.get("user")
    }
  },
  methods: {
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
    logout() {
      VueCookies.remove('user')
      this.user = null
      window.location.reload()
    }
  }
}

/*
YAPILACAKLAR
[x] kullanicilarin profil sayfasinda following and followers bolumleri olacak
takip et buttonuna tiklandiginda kisinin takipcileri arasinda yer alacak
ve kullanicinin takip ettikleri arasinda takip edilen kisi yer alacak
       
[] takip edilen kisilerin postlari kullanicinin anasayfasinda gozukecek.
global diye bir sayfa olacak ve bu sayfada tum kullanicilarin postlari gozukecek.
global sayfada postlari gosterme secenekleri olacak (en son yazilan, en cok favlanan vs vs)
 
[] takip ettigi veya etmedigi herkesin postuna fav ve yorum yapma ozelligi eklensin

[] kayit basarili oldugunda bir ozellestirme sayfasina yonlendirilsin
bu sayfada kullanicinin ilgisini cekebilecek olan kategory alanlari gosterilsin
kullanici isterse hepsini isterse de bir bolumunu secerek devam etsin
secilen kategoryler kullanicinin ana sayfasinda en cok gosterilecek kategoryler olsun

POSTLAR
[] postlarda fav, yorum ve goruldu ozellikleri bulunsun
yorumlar yapildigi an gozukecek ve yorumlara da fav gelebilir.
en cok fav alan yorumlar en ustte gosterilir
gelen fav ve yorumlar yazara bildirim olarak gonderilir

PROFIL SAYFASI
[] her kullanicinin bir profil sayfasi olacak
profil sayfasinda user ise favladigi postlar takip ettigi yazarlar ve sectigi kategoryler olacak
yorum sikayet etme secenegi olacak
yorumuna gelen favlar veya cevaplarin bildirimleri olacak

yazar ise user sayfasina ek olarak takipcileri olacak, takip ettigi yazarlar olacak
kendi paylastigi postlarin bulundugu bir alani olacak
post hazirlayacagi sayfa olacak
yazarin bir alanda paylasmak istedigi (zorunlu degil) sosyal medya hesaplari olacak

editor ise yazar sayfasina ek olarak onay bekleyen gonreilerin bulundugu alan olacak
editorun bildirimleri yazardan gelecek bildirimler onay bekleyen ve guncelleme bekleyen post bildirimleri olck.

root ise editor sayfasina ek olarak kullanici onaylama, kullanici silme, post silme, post onaylama
kullanici yetkisi belirleme (editor,yazar)
market sayfasini yonetme bolumu olacak


POST SAYFASI
[] post sayfasinda h1 ile baslik olacak.
one cikan gorsel, basligin hemen altinda gozukecek
post yazisi ve geri kalan alanlar hemen asagisinda gozukecek
fav, gorulme, ve tarih hemen post yazisinin altinda olacak
yorumlar gorulmelerin altinda olacak
yorumlerin altinda ise benzer kategorylerdeki postlardan 5 tanesi onerilen post olarak gozukecek

KATEGORY SAYFASI
baslangicta kategory ismi h1 etiketi ile en uste yer alacak
asagisinda 20 post bulunacak. kullanici asagiya kaydirdikca yeni postlar (+20 adet) gozugecek
eger 3 defa yeni postlar geldi ise yeni yuklemeler otomatik olmadan link seklinde devamini goster olacak
devamini gostere tiklandiginda tekrar otomatik 3 adet yeni postlar gelene kadar devam edecek

KART SAYFASI
https://tinyurl.com/2c3499kp
[] resimde gozuktugu gibi yukari kisma resim gelecek.
resmin hemen altina post basligi gelecek
basligin altina postun aciklamasi gelecek
en alt kisimda 'yazar', 'kategory', 'date', 'fav,gorulme,yorum sayisi' gelecek
resme ve yazi basligina tiklandiginda postun sayfasina gidecek
kategorye tiklandiginda kategory sayfasina, yazar ismine tiklandiginda yazarin profile sayfasina gidecek
fav gorulme ve yorum sayisina tiklandiginda yine postun sayfasina gidilecek

SEARCH SAYFASI
[] arama yapilan kelime butun postlarin icerigi arasinda aranacak ve eslesen postlar arama sayfasinda listelenecek
arama sayfasinda sol kisimda post,profil,kategory bolumleri olacak
profile tiklandiginda aranan kelimeye eslesen profiller listelenecek

MARKET
[] market sayfasinda kart seklinde urunler gosterilecek.



[] postlarda tutulacak bilgiler
1 baslik
2 aciklama
3 resimurl
4 yazarin id si
5 kategory


DATABASE
[] users adinda koleksiyon olacak
gelecek olan bilgiler

if kullanici==user
userid, name, username, mail, password, ensongiristarigi, kayittarigi,
diziler[ipadresleri, following, fav, comments, bildirimler, sikayetler]

if kullanici==yazar
diziler[postlar, followers,]


if kullanici==editor
diziler[onay bekleyenler, onayladiklarim,]

if kullanici==root

[] kategoryler koleksiyonu
burada post olusturulurken postun id si ve autor id si bu koleksiyona eklenecek

[] posts
butun postlar burda tutulacak. kullanicinin id si post bilgileri icinde olacak
users koleksiyonunda yazarin posts adli array inde bu postlarin bilgisi tutulacak















*/


</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.3/css/bulma.min.css');

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-burger {
  border: none;
  background-color: transparent;
  padding: 0.5rem;
}

.navbar-burger span {
  display: block;
  width: 1.5rem;
  height: 0.2rem;
  margin: 0.3rem;
  background-color: #333;
  transition: transform 0.3s ease-in-out;
}

.navbar-burger span:first-child {
  transform: rotate(45deg);
}

.navbar-burger span:nth-child(2) {
  transform: scaleX(0);
}

.navbar-burger span:last-child {
  transform: rotate(-45deg);
}


.navbar-menu.is-active {
  display: block;
}

.navbar-start {
  margin-right: auto;
}

.navbar-item {
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.navbar-item:hover {
  background-color:  #3e8e41;
}


.button,
.my-button {
  margin: 10px 0;
  margin-left: 5px;
  margin-right: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
}

.button:hover,
.my-button:hover {
  background-color: #3e8e41;
  color: darkblue;
}

.buttons .button {
  margin-left: 0.5rem;
}
</style>
