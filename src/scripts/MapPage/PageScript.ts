import { ref } from 'vue';
import { estraiDati, Posted } from './estraiDati';
import { AggiornaMappa, chiudiPopUpAnim, apriPopUpAnim, getMapCenter, teletrasportati } from './map';
import { estraiCategorie, estraieventoid, estraipartyid } from './popup';
import { loggedUser } from '../../states/loggedUser';
import {getPosition} from '../Tools/posizione';

export const showPopupCreaPost = ref(false);
export const showPopupCreaEvento = ref(false);
export const showPopupCreaParty = ref(false);
export const showPopupPost = ref(false);
export const showPopupPartyEvento = ref(false);
export const filtri = ref({
  post: true,
  textual: true,
  evento: true,
  party: true,
});
export const selectedOption = ref('');
export const isLoading = ref(true);
export var sideCards = ref<Posted[]>([]);
export var categorie = ref([]);
export var postUserName = ref('');
export var userIdView = ref('');
export var postProfilePicture = ref('');
export var postTime = ref('');
export var postImage = ref('');
export var postDescription = ref('');
export var idp = ref('');
export var profileNameep = ref('');
export var userIdViewep = ref('');
export var profileImageep = ref('');
export var timeep = ref('');
export var partyImageep = ref('');
export var descriptionep = ref('');
export var currentParticipantsep = ref();
export var maxParticipantsep = ref('');
export var categoryep = ref('');
export var organizza = ref();
export var isParty = ref();
export var idep = ref('');


export interface FiltriRicerca {
  post: boolean;
  textual: boolean;
  evento: boolean;
  party: boolean;
}

export function CloseAllPopup() {
  showPopupCreaPost.value = false;
  showPopupCreaParty.value = false;
  showPopupCreaEvento.value = false;
  showPopupPost.value = false;
  showPopupPartyEvento.value = false;
}

export async function aggiornaTutto(filtri: FiltriRicerca, latitudine: number, longitudine: number, raggio: number) {
  const cards = await estraiDati(latitudine, longitudine, raggio);
  const filteredCards = cards.filter(card => filtraCard(card, filtri));
  const shuffledCards = shuffledArray(filteredCards);
  sideCards.value = shuffledCards;
  categorie.value = await estraiCategorie();
  await AggiornaMappa(shuffledCards);
}

export async function ordinaSidebar(tipo: string = '') {
  let cards = sideCards.value;
  if (tipo) {
    cards.sort((a, b) => a.dataType === tipo && b.dataType !== tipo ? -1 : (a.dataType !== tipo && b.dataType === tipo ? 1 : 0));
  } else {
    cards = shuffledArray(cards);
  }
  sideCards.value = cards;
}

export async function openPopup(type:any, posizione:any) {
  CloseAllPopup();
  if (posizione == null && (type == "CreaPost" || type == "CreaParty" || type == "CreaEvento")) {
    var posizione2 = await getPosition();
    posizione = { lat: posizione2.latitudine, lng: posizione2.longitudine };
    teletrasportati(posizione.lat, posizione.lng);
}
  console.log(posizione);
  apriPopUpAnim(posizione);
  if (type == "CreaPost") showPopupCreaPost.value = true;
  if (type == "CreaParty") showPopupCreaParty.value = true;
  if (type == "CreaEvento") showPopupCreaEvento.value = true;
  if (type == "VisualizzaPost") showPopupPost.value = true; 
  if (type == "VisualizzaPartyEvento") showPopupPartyEvento.value = true; 
}

export function closePopup(type: any) {
  chiudiPopUpAnim();
  if (type == "CreaPost") showPopupCreaPost.value = false;
  if (type == "CreaParty") showPopupCreaParty.value = false;
  if (type == "CreaEvento") showPopupCreaEvento.value = false;
  if (type == "VisualizzaPost") showPopupPost.value = false; 
  if (type == "VisualizzaPartyEvento") showPopupPartyEvento.value = false; 
}


export function selectOption(option: string) {
  selectedOption.value = selectedOption.value === option ? '' : option;
  ordinaSidebar(selectedOption.value);
}

export async function Aggiorna(rad: number = 15): Promise<void> {
  try {
    isLoading.value = true;
    const posizioneCentroMappa = getMapCenter();
    await aggiornaTutto(filtri.value, posizioneCentroMappa.lat, posizioneCentroMappa.lng, rad);
    if (selectedOption.value) await ordinaSidebar(selectedOption.value);
  } catch (error) {
    alert("Errore durante l'aggiornamento: " + error);
  } finally {
    isLoading.value = false;
  }
}

export async function apriPopUpVisualizza(dati: any) {
  if (dati.dataType === 'post') {
    setPostData(dati);
    openPopup('VisualizzaPost', { lat: dati.latitudine, lng: dati.longitudine });
  } else if (dati.dataType === 'party') {
    await setPartyData(dati);
  } else if (dati.dataType === 'evento') {
    await setEventoData(dati);
  }
}

function filtraCard(card: any, filtri: FiltriRicerca) {
  switch (card.dataType) {
    case 'post': return filtri.post;
    case 'textual': return filtri.textual;
    case 'evento': return filtri.evento;
    case 'party': return filtri.party;
    default: return false;
  }
}

function shuffledArray(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}


async function setPostData(dati: any) {
  idp.value = dati.dataIndex;
  organizza.value = (dati.id === loggedUser.id);
  postUserName.value = dati.profileName;
  userIdView.value = dati.id;
  postProfilePicture.value = dati.profileImage;
  postTime.value = '12 dicembre';
  postImage.value = dati.postImage;
  postDescription.value = dati.description;
}

async function setPartyData(dati: any) {
  organizza.value = (dati.id === loggedUser.id);
  isParty.value = true;
  idep.value = dati.dataIndex;
  const party = await estraipartyid(dati.dataIndex);
  if (party) {
    profileNameep.value = party.profileName;
    userIdViewep.value = party.id;
    profileImageep.value = party.profileImage;
    partyImageep.value = party.postImage;
    descriptionep.value = party.description;
    maxParticipantsep.value = party.maxpartecipanti;
    categoryep.value = party.Categoria;
    timeep.value = party.time;
    openPopup('VisualizzaPartyEvento', { lat: dati.latitudine, lng: dati.longitudine });
  }
}

async function setEventoData(dati: any) {
  organizza.value = (dati.id === loggedUser.id);
  isParty.value = false;
  idep.value = dati.dataIndex;
  const evento = await estraieventoid(dati.dataIndex);
  if (evento) {
    profileNameep.value = evento.profileName;
    userIdViewep.value = evento.id;
    profileImageep.value = evento.profileImage;
    timeep.value = evento.time;
    partyImageep.value = evento.postImage;
    descriptionep.value = evento.description;
    maxParticipantsep.value = evento.maxpartecipanti;
    categoryep.value = evento.Categoria;
    openPopup('VisualizzaPartyEvento', { lat: dati.latitudine, lng: dati.longitudine });
  }
}
