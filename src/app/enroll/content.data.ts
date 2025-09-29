export interface Faq {
  question: string;
  answer: string;
}

export interface Benefits {
  icon: string;
  title: string;
  description: string;
}

export const FAQ_LIST: Faq[] = [
    {
      question: 'Ce înseamnă să te înscrii în doTERRA?',
      answer: 'Înscrierea înseamnă crearea unui <strong>cont personal doTERRA</strong>, prin intermediul unui îndrumător. Asta îți oferă acces la reducere de 25% la toate comenzile, sprijin direct, acces la comunitate și posibilitatea de a acumula puncte pentru produse gratuite.'
    },
    {
      question: 'Care sunt avantajele înscrierii printr-un îndrumător?',
      answer: 'Înscriindu-te printr-un îndrumător, ai parte de <strong>sprijin personalizat</strong>, recomandări pentru a folosi corect uleiurile esențiale și <strong>acces la comunitate</strong>, unde primești informații și resurse exclusive. Practic, nu pornești singur în această călătorie.'
    },
    {
      question: 'Cum este desemnat îndrumătorul lunii?',
      answer: 'În fiecare lună are loc o prezentare pe o temă specială, susținută de un membru al comunității. Persoana care prezintă devine <strong>îndrumătorul lunii</strong>. Dacă alegi să te înscrii prin el, vei primi sprijin nu doar pe durata lunii respective, ci și pe termen lung. Desigur, ai libertatea de a alege și un alt îndrumător din lista disponibilă.'
    },
    {
      question: 'Cum aleg kitul potrivit?',
      answer: 'Dacă nu ești sigur ce kit ți se potrivește, te putem ajuta! Completează formularul de pe pagina <strong>Contact</strong> și vei primi sprijin direct de la echipa <strong>Dăruim Renaștere</strong>.'
    },
    {
      question: 'Pot să mă înscriu fără kit?',
      answer: '<strong>Da, este posibil.</strong> Tot ce trebuie să faci este să apeși pe butonul <strong>„Înscrie-te cu produse alese”</strong>, iar apoi vei putea să-ți selectezi produsele preferate, fără să alegi un kit.'
    },
    {
      question: 'Pot primi mostre dacă am deja cont?',
      answer: 'Mostrele sunt disponibile doar pentru cei care <strong>nu au mai testat uleiurile doTERRA</strong> și <strong>nu au un îndrumător activ</strong>.'
    },
];

export const BENEFITS: Benefits[] = [
  {
    icon: 'remixUserCommunityLine',
    title: 'Acces la comunitate',
    description: 'Alătură-te unei rețele de oameni pasionați de sănătate naturală.'
  },
  {
    icon: 'remixShakeHandsLine',
    title: 'Sprijin direct de la îndrumător',
    description: 'Vei primi răspunsuri și ghidare personalizată.'
  },
  {
    icon: 'remixDiscountPercentLine',
    title: 'Reducere de 25% la comenzi',
    description: 'Beneficiezi de prețuri preferențiale pentru toate produsele.'
  },
  {
    icon: 'remixGiftLine',
    title: 'Puncte pentru produse gratuite',
    description: 'Primești înapoi 10-30% din valoarea comenzilor tale.'
  }
];