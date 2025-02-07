import { ref } from 'vue';
import { estraiDati, Posted, estraiCategorie, estraieventoid, estraipartyid } from './estraiDati';
import { aggiornaMappa, chiudiPopUpAnim, apriPopUpAnim, getMapCenter, teletrasportati } from './Mappa';
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
export var postUserId = ref('');
export var postProfilePicture = ref('');
export var postTime = ref('');
export var postImage = ref('');
export var postDescription = ref('');
export var postId = ref('');
export var eventUsername = ref('');
export var eventUserId = ref('');
export var eventProfilePicture = ref('');
export var eventTime = ref('');
export var eventImage = ref('');
export var eventDescription = ref('');
export var currentParticipantsep = ref();
export var eventMaxPartecipants = ref('');
export var eventCategory = ref('');
export var organizza = ref();
export var isParty = ref();
export var eventId = ref('');


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
  await aggiornaMappa(shuffledCards);
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

export async function aggiorna(rad: number = 15): Promise<void> {
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
  postId.value = dati.dataIndex;
  organizza.value = (dati.id === loggedUser.id);
  postUserName.value = dati.profileName;
  postUserId.value = dati.id;
  postProfilePicture.value = dati.profileImage;
  postTime.value = dati.dataCreazione;
  postImage.value = dati.postImage;
  postDescription.value = dati.description;
}

async function setPartyData(dati: any) {
  organizza.value = (dati.id === loggedUser.id);
  isParty.value = true;
  eventId.value = dati.dataIndex;
  const party = await estraipartyid(dati.dataIndex);
  if (party) {
    eventUsername.value = party.profileName;
    eventUserId.value = party.id;
    eventProfilePicture.value = party.profileImage;
    eventImage.value = party.postImage;
    eventDescription.value = party.description;
    eventMaxPartecipants.value = party.maxpartecipanti;
    eventCategory.value = party.Categoria;
    eventTime.value = party.time;
    console.log(party.time);
    openPopup('VisualizzaPartyEvento', { lat: dati.latitudine, lng: dati.longitudine });
  }
}

async function setEventoData(dati: any) {
  organizza.value = (dati.id === loggedUser.id);
  isParty.value = false;
  eventId.value = dati.dataIndex;
  const evento = await estraieventoid(dati.dataIndex);
  if (evento) {
    eventUsername.value = evento.profileName;
    eventUserId.value = evento.id;
    eventProfilePicture.value = evento.profileImage;
    eventTime.value = evento.time;
    eventImage.value = evento.postImage;
    eventDescription.value = evento.description;
    eventMaxPartecipants.value = evento.maxpartecipanti;
    eventCategory.value = evento.Categoria;
    openPopup('VisualizzaPartyEvento', { lat: dati.latitudine, lng: dati.longitudine });
  }
}
