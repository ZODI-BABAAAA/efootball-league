let currentUser = null;
let userTeamProfile = null;
let ligler = {};
let registeredUsers = {};

const DEFAULT_BALE_LOGO = "https://i.ibb.co/L8bZ0Yx/gareth-bale.jpg";

const ZDC_ADMIN = {
  username: "Zodiac𖦏",
  email: "admin@zodiachub.com",
  pass: "𖦏",
  id: "ZDC",
  isAdmin: true,
  isBanned: false,
  profile: null
};

registeredUsers[ZDC_ADMIN.username] = ZDC_ADMIN;

function ekranDegistir(screenId) {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('registerScreen').classList.add('hidden');
  document.getElementById('teamSetupScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.add('hidden');

  document.getElementById(screenId).classList.remove('hidden');
}

function kayitol() {
  const user = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value.trim();

  if(!user || !email || !pass) { alert("Lütfen tüm alanları doldurun!"); return; }

  registeredUsers[user] = { 
    username: user, 
    email: email, 
    pass: pass, 
    id: "USR-" + Math.floor(100 + Math.random() * 900),
    isAdmin: false,
    isBanned: false,
    profile: null 
  };

  alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
  ekranDegistir('authScreen');
}

function girisYap() {
  const user = document.getElementById('authUsername').value.trim();
  const pass = document.getElementById('authPassword').value.trim();

  let targetUser = null;
  if (user === "Zodiac𖦏" && pass === "𖦏") {
    targetUser = registeredUsers["Zodiac𖦏"];
  } else if(registeredUsers[user] && registeredUsers[user].pass === pass) {
    targetUser = registeredUsers[user];
  }

  if (!targetUser) { alert("Hatalı kullanıcı adı veya şifre!"); return; }
  if (targetUser.isBanned) { alert("⛔ Hesabınız Yönetici (ZDC) tarafından askıya alınmıştır!"); return; }

  currentUser = targetUser;

  document.getElementById('userBar').classList.remove('hidden');
  document.getElementById('barUsername').innerText = currentUser.username;
  document.getElementById('barId').innerText = currentUser.id;

  if(currentUser.id === "ZDC" || currentUser.isAdmin) {
    document.getElementById('zdcAdminTrigger').classList.remove('hidden');
  } else {
    document.getElementById('zdcAdminTrigger').classList.add('hidden');
  }

  if(currentUser.profile) {
    userTeamProfile = currentUser.profile;
    ekranDegistir('mainApp');
    sekmeDegistir('liglerim');
  } else {
    ekranDegistir('teamSetupScreen');
  }
}

let loadedBase64Logo = null;
function previewLogo(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      loadedBase64Logo = e.target.result;
      document.getElementById('logoPreview').src = loadedBase64Logo;
    };
    reader.readAsDataURL(file);
  }
}

function takimProfiliniKaydet() {
  const name = document.getElementById('profileTeamName').value.trim();
  const short = document.getElementById('profileTeamShort').value.trim().toUpperCase();
  const power = document.getElementById('profileTeamPower').value.trim();
  const logo = loadedBase64Logo ? loadedBase64Logo : DEFAULT_BALE_LOGO;

  if(!name || !short) { alert("Lütfen Takım Adı ve Kısaltmasını doldurun!"); return; }

  userTeamProfile = { name: name, short: short, power: power || "0", logo: logo };
  currentUser.profile = userTeamProfile;

  document.getElementById('joinTeamPreviewImg').src = logo;
  document.getElementById('joinTeamPreview').innerText = `${name} (${short}) - Güç: ${power || "0"}`;

  alert("Takım profiliniz kaydedildi!");
  ekranDegistir('mainApp');
  sekmeDegistir('liglerim');
}

function cikisYap() {
  currentUser = null;
  userTeamProfile = null;
  document.getElementById('userBar').classList.add('hidden');
  document.getElementById('zdcAdminTrigger').classList.add('hidden');
  ekranDegistir('authScreen');
}

function sekmeDegistir(tabName) {
  document.getElementById('sec-liglerim').classList.add('hidden');
  document.getElementById('sec-ligKur').classList.add('hidden');
  document.getElementById('sec-ligeKatil').classList.add('hidden');
  document.getElementById('sec-ligDetay').classList.add('hidden');

  if(tabName === 'liglerim') {
    document.getElementById('sec-liglerim').classList.remove('hidden');
    ligleriListele();
  } else if(tabName === 'ligKur') {
    document.getElementById('sec-ligKur').classList.remove('hidden');
  } else if(tabName === 'ligeKatil') {
    if(userTeamProfile) {
      document.getElementById('joinTeamPreviewImg').src = userTeamProfile.logo;
      document.getElementById('joinTeamPreview').innerText = `${userTeamProfile.name} (${userTeamProfile.short}) - Güç: ${userTeamProfile.power}`;
    }
    document.getElementById('sec-ligeKatil').classList.remove('hidden');
  }
}

function ligOlustur() {
  const ligId = document.getElementById('newLigId').value.trim();
  const ligName = document.getElementById('newLigName').value.trim();
  const matchCount = parseInt(document.getElementById('newMatchCount').value);

  if(!ligId || !ligName) { alert("Lig ID ve Adı girin!"); return; }
  if(ligler[ligId]) { alert("Bu Lig ID zaten var!"); return; }

  let yeniLig = {
    id: ligId, name: ligName, liderId: currentUser.id, turSayisi: matchCount,
    takimlar: [], puanTablosu: {}, sohbet: [], katilimcilar: [currentUser.id]
  };

  // Kurucunun Takımı Varsa Otomatik Ekle
  if(userTeamProfile) {
    let tName = userTeamProfile.name;
    yeniLig.takimlar.push(tName);
    yeniLig.puanTablosu[tName] = {
      name: tName, short: userTeamProfile.short, power: userTeamProfile.power, logo: userTeamProfile.logo,
      o: 0, toplamPuan: 0
    };
  }

  ligler[ligId] = yeniLig;

  alert(`"${ligName}" kuruldu!`);
  document.getElementById('newLigId').value = "";
  document.getElementById('newLigName').value = "";
  sekmeDegistir('liglerim');
}

// LİGE KATILMA SİSTEMİ TAMAMEN DÜZELTİLDİ
function ligeKatil() {
  const ligId = document.getElementById('joinLigId').value.trim();
  if(!ligler[ligId]) { alert("Lig bulunamadı! Lütfen Lig ID'sini doğru girin."); return; }
  if(!userTeamProfile) { alert("Lütfen önce takım profilinizi oluşturun!"); return; }

  let lig = ligler[ligId];
  let tName = userTeamProfile.name;

  if(!lig.katilimcilar.includes(currentUser.id)) {
    lig.katilimcilar.push(currentUser.id);
  }

  if(!lig.takimlar.includes(tName)) {
    lig.takimlar.push(tName);
  }

  // Takımı Puan Tablosuna Kaydet
  lig.puanTablosu[tName] = {
    name: tName,
    short: userTeamProfile.short,
    power: userTeamProfile.power,
    logo: userTeamProfile.logo,
    o: 0,
    toplamPuan: 0
  };

  alert(`"${tName}" takımıyla lige başarıyla katıldınız!`);
  document.getElementById('joinLigId').value = "";
  ligDetayAc(ligId);
}

function ligleriListele() {
  const container = document.getElementById('ligListesi');
  container.innerHTML = "";
  let count = 0;

  for(let key in ligler) {
    let lig = ligler[key];
    if(lig.katilimcilar.includes(currentUser.id) || currentUser.id === "ZDC" || currentUser.isAdmin) {
      count++;
      container.innerHTML += `
        <div style="background:rgba(30, 41, 59, 0.6); padding:12px; border-radius:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <div><b>${lig.name}</b> <small style="color:var(--accent-gold)">(${lig.id})</small></div>
          <button onclick="ligDetayAc('${lig.id}')" style="width:auto; padding:6px 12px; font-size:0.8rem;">Aç</button>
        </div>
      `;
    }
  }
  if(count === 0) container.innerHTML = "<p style='font-size:0.85rem; color:var(--text-muted);'>Henüz bir lige katılmadınız.</p>";
}

let activeLigId = null;
function ligDetayAc(ligId) {
  activeLigId = ligId;
  let lig = ligler[ligId];

  document.getElementById('sec-liglerim').classList.add('hidden');
  document.getElementById('sec-ligeKatil').classList.add('hidden');
  document.getElementById('sec-ligDetay').classList.remove('hidden');

  document.getElementById('activeLigTitle').innerText = lig.name;
  document.getElementById('activeLigIdDisplay').innerText = lig.id;

  let isAdmin = (currentUser.id === "ZDC" || currentUser.id === lig.liderId || currentUser.isAdmin);
  document.getElementById('adminSkorPanel').classList.toggle('hidden', !isAdmin);

  menuTakimlariniGuncelle();
  puanTablosunuGuncelle();
  chatGuncelle();
}

function menuTakimlariniGuncelle() {
  let lig = ligler[activeLigId];
  let evSelect = document.getElementById('skorEvSelect');
  let depSelect = document.getElementById('skorDeplasmanSelect');
  let penSelect = document.getElementById('penaltyTeamSelect');

  evSelect.innerHTML = `<option value="">Ev Sahibi Takım</option>`;
  depSelect.innerHTML = `<option value="">Deplasman Takım</option>`;
  penSelect.innerHTML = `<option value="">Takım Seçin</option>`;

  lig.takimlar.forEach(t => {
    evSelect.innerHTML += `<option value="${t}">${t}</option>`;
    depSelect.innerHTML += `<option value="${t}">${t}</option>`;
    penSelect.innerHTML += `<option value="${t}">${t}</option>`;
  });
}

function puanTablosunuGuncelle() {
  let lig = ligler[activeLigId];
  let tbody = document.getElementById('puanTablosuBody');
  tbody.innerHTML = "";

  let list = [];
  for(let t in lig.puanTablosu) {
    list.push(lig.puanTablosu[t]);
  }

  if(list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:var(--text-muted); padding:15px;">Henüz bu lige katılmış bir takım yok.</td></tr>`;
    return;
  }

  list.sort((a, b) => b.toplamPuan - a.toplamPuan);

  list.forEach((p, index) => {
    tbody.innerHTML += `
      <tr class="${index === 0 ? 'rank-1' : ''}">
        <td>${index + 1}</td>
        <td style="text-align:left;"><img src="${p.logo}" class="team-logo-small"> <b>${p.name}</b> (${p.short})</td>
        <td>⚡${p.power}</td>
        <td>${p.o}</td>
        <td><b>${p.toplamPuan}</b></td>
      </tr>
    `;
  });
}

function macSkoruKaydet() {
  let lig = ligler[activeLigId];
  let ev = document.getElementById('skorEvSelect').value;
  let dep = document.getElementById('skorDeplasmanSelect').value;
  let evGol = parseInt(document.getElementById('skorEvGol').value);
  let depGol = parseInt(document.getElementById('skorDepGol').value);

  if(!ev || !dep) { alert("Lütfen maç yapacak takımları seçin!"); return; }
  if(ev === dep) { alert("Aynı takımlar birbiriyle maç yapamaz!"); return; }
  if(isNaN(evGol) || isNaN(depGol)) { alert("Geçerli gol sayıları girin!"); return; }

  lig.puanTablosu[ev].o++; lig.puanTablosu[dep].o++;
  if(evGol > depGol) lig.puanTablosu[ev].toplamPuan += 3;
  else if(depGol > evGol) lig.puanTablosu[dep].toplamPuan += 3;
  else { lig.puanTablosu[ev].toplamPuan += 1; lig.puanTablosu[dep].toplamPuan += 1; }

  document.getElementById('skorEvGol').value = "";
  document.getElementById('skorDepGol').value = "";

  puanTablosunuGuncelle();
}

// YENİLENMİŞ NEDENLİ VE PUAN SEÇMELİ CEZA / ÖDÜL SİSTEMİ
function puanCezasiIsle() {
  let lig = ligler[activeLigId];
  let targetTeam = document.getElementById('penaltyTeamSelect').value;
  let type = document.getElementById('penaltyType').value;
  let amount = parseInt(document.getElementById('penaltyAmount').value);
  let reason = document.getElementById('penaltyReason').value.trim();

  if(!targetTeam) { alert("Lütfen bir takım seçin!"); return; }
  if(isNaN(amount) || amount <= 0) { alert("Geçerli bir puan miktarı girin!"); return; }

  let finalPuan = type === "ödül" ? amount : -amount;
  lig.puanTablosu[targetTeam].toplamPuan += finalPuan;

  let reasonText = reason ? ` ("${reason}" nedeniyle)` : "";
  let islemText = type === "ödül" ? `+${amount} Puan Ödül verildi!` : `-${amount} Puan Ceza kesildi!`;

  lig.sohbet.push({ 
    sender: "SİSTEM", 
    badge: "zdc", 
    text: `⚠️ ${targetTeam} takımına${reasonText} ${islemText}` 
  });

  document.getElementById('penaltyAmount').value = "";
  document.getElementById('penaltyReason').value = "";

  puanTablosunuGuncelle();
  chatGuncelle();
}

function mesajGonder() {
  let txt = document.getElementById('chatInput').value.trim();
  if(!txt) return;

  let lig = ligler[activeLigId];
  let badge = currentUser.id === "ZDC" ? "zdc" : (currentUser.id === lig.liderId ? "lider" : "oyuncu");
  lig.sohbet.push({ sender: currentUser.username, badge: badge, text: txt });
  
  document.getElementById('chatInput').value = "";
  chatGuncelle();
}

function chatGuncelle() {
  let lig = ligler[activeLigId];
  let container = document.getElementById('chatContainer');
  container.innerHTML = "";

  lig.sohbet.forEach(msg => {
    let badgeHtml = msg.badge === "zdc" ? `<span class="badge badge-zdc">ZDC 👑</span>` : (msg.badge === "lider" ? `<span class="badge badge-lider">Lider ⭐</span>` : "");
    container.innerHTML += `<div class="chat-msg">${badgeHtml} <b>${msg.sender}:</b> ${msg.text}</div>`;
  });
}

/* ADMIN MODAL, BAN VE YETKİ MANTIĞI */
function adminModalAc() {
  document.getElementById('adminModal').classList.remove('hidden');
  adminKullaniciListele();
}

function adminModalKapat() {
  document.getElementById('adminModal').classList.add('hidden');
}

function adminKullaniciListele() {
  const container = document.getElementById('adminUserList');
  container.innerHTML = "<h4>Kullanıcı Listesi</h4>";

  for(let username in registeredUsers) {
    let u = registeredUsers[username];
    let statusText = u.isBanned ? "<span style='color:red;'>[BANLI]</span> " : "";
    let adminText = u.isAdmin ? "<span style='color:gold;'>[ADMIN]</span> " : "";

    container.innerHTML += `
      <div class="user-item">
        <div>
          <b>${statusText}${adminText}${u.username}</b> (${u.id})<br>
          <small style="color:var(--text-muted);">${u.email}</small>
        </div>
        <button onclick="adminKullaniciDuzenleAc('${u.username}')" class="btn-secondary" style="width:auto; padding:4px 10px; font-size:0.75rem;">Düzenle</button>
      </div>
    `;
  }
}

function adminKullaniciDuzenleAc(targetUsername) {
  let u = registeredUsers[targetUsername];
  document.getElementById('adminEditForm').classList.remove('hidden');

  document.getElementById('editOriginalUsername').value = u.username;
  document.getElementById('editUsername').value = u.username;
  document.getElementById('editEmail').value = u.email;
  document.getElementById('editPassword').value = u.pass;
  document.getElementById('editUserId').value = u.id;

  if(u.profile) {
    document.getElementById('editTeamName').value = u.profile.name || "";
    document.getElementById('editTeamShort').value = u.profile.short || "";
    document.getElementById('editTeamPower').value = u.profile.power || "";
  } else {
    document.getElementById('editTeamName').value = "";
    document.getElementById('editTeamShort').value = "";
    document.getElementById('editTeamPower').value = "";
  }

  document.getElementById('btnToggleBan').innerText = u.isBanned ? "Banı Kaldır" : "Kullanıcıyı Banla";
  document.getElementById('btnToggleAdmin').innerText = u.isAdmin ? "Admin Yetkisini Al" : "Admin Yap";
}

function adminKullaniciKaydet() {
  let origUser = document.getElementById('editOriginalUsername').value;
  let newUser = document.getElementById('editUsername').value.trim();
  let newEmail = document.getElementById('editEmail').value.trim();
  let newPass = document.getElementById('editPassword').value.trim();
  let newId = document.getElementById('editUserId').value.trim();
  let newTName = document.getElementById('editTeamName').value.trim();
  let newTShort = document.getElementById('editTeamShort').value.trim();
  let newTPower = document.getElementById('editTeamPower').value.trim();

  let u = registeredUsers[origUser];

  if(origUser !== newUser) {
    delete registeredUsers[origUser];
    u.username = newUser;
    registeredUsers[newUser] = u;
  }

  u.email = newEmail;
  u.pass = newPass;
  u.id = newId;

  if(!u.profile) u.profile = { logo: DEFAULT_BALE_LOGO };
  u.profile.name = newTName;
  u.profile.short = newTShort;
  u.profile.power = newTPower;

  alert("Kullanıcı bilgileri güncellendi!");
  document.getElementById('adminEditForm').classList.add('hidden');
  adminKullaniciListele();
}

function adminBanDegistir() {
  let origUser = document.getElementById('editOriginalUsername').value;
  let u = registeredUsers[origUser];
  u.isBanned = !u.isBanned;

  alert(`${u.username} adlı kullanıcının ban durumu güncellendi! (Durum: ${u.isBanned ? 'Banlı' : 'Aktif'})`);
  document.getElementById('adminEditForm').classList.add('hidden');
  adminKullaniciListele();
}

function adminYetkiDegistir() {
  let origUser = document.getElementById('editOriginalUsername').value;
  let u = registeredUsers[origUser];
  u.isAdmin = !u.isAdmin;

  alert(`${u.username} adlı kullanıcının Admin yetkisi güncellendi! (Durum: ${u.isAdmin ? 'Admin' : 'Normal Oyuncu'})`);
  document.getElementById('adminEditForm').classList.add('hidden');
  adminKullaniciListele();
}
