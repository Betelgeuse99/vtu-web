import React, { useState, useCallback } from 'react';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Plus, Trash2, Eye } from 'lucide-react';

const STATES_LGAS = {"Abia":["Aba North","Aba South","Arochukwu","Bende","Ikwuano","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Obi Ngwa","Ohafia","Osisioma","Ugwunagbo","Ukwa East","Ukwa West","Umuahia North","Umuahia South","Umu Nneochi"],"Adamawa":["Demsa","Fufure","Ganye","Girei","Gombi","Guyuk","Hong","Jada","Lamurde","Madagali","Maiha","Mayo Belwa","Michika","Mubi North","Mubi South","Numan","Shelleng","Song","Toungo","Yola North","Yola South"],"Akwa Ibom":["Abak","Eastern Obolo","Eket","Esit Eket","Essien Udim","Etim Ekpo","Etinan","Ibeno","Ibesikpo Asutan","Ibiono Ibom","Ika","Ikono","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat Enin","Nsit Atai","Nsit Ibom","Nsit Ubium","Obot Akara","Okobo","Onna","Oron","Oruk Anam","Udung Uko","Ukanafun","Uruan","Urue Offong/Oruko","Uyo"],"Anambra":["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],"Bauchi":["Alkaleri","Bauchi","Bogoro","Damban","Darazo","Dass","Gamawa","Ganjuwa","Giade","Itas/Gadau","Jama'are","Katagum","Kirfi","Misau","Ningi","Shira","Tafawa Balewa","Toro","Warji","Zaki"],"Bayelsa":["Brass","Ekeremor","Kolokuma/Opokuma","Nembe","Ogbia","Sagbama","Southern Ijaw","Yenagoa"],"Benue":["Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West","Katsina-Ala","Konshisha","Kwande","Logo","Makurdi","Obi","Ogbadibo","Ohimini","Oju","Okpokwu","Otukpo","Tarka","Ukum","Ushongo","Vandeikya"],"Borno":["Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala/Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"],"Cross River":["Abi","Akamkpa","Akpabuyo","Bakassi","Bekwarra","Biase","Boki","Calabar Municipal","Calabar South","Etung","Ikom","Obanliku","Obubra","Obudu","Odukpani","Ogoja","Yakurr","Yala"],"Delta":["Aniocha North","Aniocha South","Bomadi","Burutu","Ethiope East","Ethiope West","Ika North East","Ika South","Isoko North","Isoko South","Ndokwa East","Ndokwa West","Okpe","Oshimili North","Oshimili South","Patani","Sapele","Udu","Ughelli North","Ughelli South","Ukwuani","Uvwie","Warri North","Warri South","Warri South West"],"Ebonyi":["Abakaliki","Afikpo North","Afikpo South","Ebonyi","Ezza North","Ezza South","Ikwo","Ishielu","Ivo","Izzi","Ohaozara","Ohaukwu","Onicha"],"Edo":["Akoko-Edo","Egor","Esan Central","Esan North-East","Esan South-East","Esan West","Etsako Central","Etsako East","Etsako West","Igueben","Ikpoba-Okha","Oredo","Orhionmwon","Ovia North-East","Ovia South-West","Owan East","Owan West","Uhunmwonde"],"Ekiti":["Ado Ekiti","Efon","Ekiti East","Ekiti South-West","Ekiti West","Emure","Gbonyin","Ido Osi","Ijero","Ikere","Ikole","Ilejemeje","Irepodun/Ifelodun","Ise/Orun","Moba","Oye"],"Enugu":["Aninri","Awgu","Enugu East","Enugu North","Enugu South","Ezeagu","Igbo Etiti","Igbo Eze North","Igbo Eze South","Isi Uzo","Nkanu East","Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo Uwani"],"FCT":["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"],"Gombe":["Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo","Kwami","Nafada","Shongom","Yamaltu/Deba"],"Imo":["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte","Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano","Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele","Obowo","Oguta","Ohaji/Egbema","Okigwe","Onuimo","Orlu","Orsu","Oru East","Oru West","Owerri Municipal","Owerri North","Owerri West"],"Jigawa":["Auyo","Babura","Biriniwa","Birnin Kudu","Buji","Dutse","Gagarawa","Garki","Gumel","Guri","Gwaram","Gwiwa","Hadejia","Jahun","Kafin Hausa","Kaugama","Kazaure","Kiri Kasama","Kiyawa","Maigatari","Malam Madori","Miga","Ringim","Roni","Sule Tankarkar","Taura","Yankwashi"],"Kaduna":["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],"Kano":["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"],"Katsina":["Bakori","Batagarawa","Batsari","Baure","Bindawa","Charanchi","Dandume","Danja","Dan Musa","Daura","Dutsi","Dutsin-Ma","Faskari","Funtua","Ingawa","Jibia","Kafur","Kaita","Kankara","Kankia","Katsina","Kurfi","Kusada","Mai'Adua","Malumfashi","Mani","Mashi","Matazu","Musawa","Rimi","Sabuwa","Safana","Sandamu","Zango"],"Kebbi":["Aleiro","Arewa Dandi","Argungu","Augie","Bagudo","Birnin Kebbi","Bunza","Dandi","Danko-Wasagu","Fakai","Gwandu","Jega","Kalgo","Koko/Besse","Maiyama","Ngaski","Sakaba","Shanga","Suru","Wasagu/Danko","Yauri","Zuru"],"Kogi":["Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah","Igalamela Odolu","Ijumu","Kabba/Bunu","Kogi","Lokoja","Mopa-Muro","Ofu","Ogori/Magongo","Okehi","Okene","Olamaboro","Omala","Yagba East","Yagba West"],"Kwara":["Asa","Baruten","Edu","Ekiti","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"],"Lagos":["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Epe","Eti-Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"],"Nasarawa":["Akwanga","Awe","Doma","Karu","Keana","Keffi","Kokona","Lafia","Nasarawa","Nasarawa Egon","Obi","Toto","Wamba"],"Niger":["Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edati","Gbako","Gurara","Katcha","Kontagora","Lapai","Lavun","Magama","Mariga","Mashegu","Mokwa","Moya","Paikoro","Rafi","Rijau","Shiroro","Suleja","Tafa","Wushishi"],"Ogun":["Abeokuta North","Abeokuta South","Ado-Odo/Ota","Egbado North","Egbado South","Ewekoro","Ifo","Ijebu East","Ijebu North","Ijebu North East","Ijebu Ode","Ikenne","Imeko Afon","Ipokia","Obafemi Owode","Odeda","Odogbolu","Ogun Waterside","Remo North","Shagamu"],"Ondo":["Akoko North-East","Akoko North-West","Akoko South-East","Akoko South-West","Akure North","Akure South","Ese Odo","Idanre","Ifedore","Ilaje","Ile Oluji/Okeigbo","Irele","Odigbo","Okitipupa","Ondo East","Ondo West","Ose","Owo"],"Osun":["Atakunmosa East","Atakunmosa West","Aiyedaade","Aiyedire","Boluwaduro","Boripe","Ede North","Ede South","Egbedore","Ejigbo","Ife Central","Ife East","Ife North","Ife South","Ila","Ilesa East","Ilesa West","Irepodun","Irewole","Isokan","Iwo","Obokun","Odo Otin","Ola Oluwa","Olorunda","Oriade","Orolu","Osogbo"],"Oyo":["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West","Saki East","Saki West","Surulere"],"Plateau":["Barkin Ladi","Bassa","Bokkos","Jos East","Jos North","Jos South","Kanam","Kanke","Langtang North","Langtang South","Mangu","Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase"],"Rivers":["Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Andoni","Asari-Toru","Bonny","Degema","Eleme","Emohua","Etche","Gokana","Ikwerre","Khana","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo","Okrika","Omuma","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai"],"Sokoto":["Binji","Bodinga","Dange Shuni","Gada","Goronyo","Gudu","Gwadabawa","Illela","Isa","Kebbe","Kware","Rabah","Sabon Birni","Shagari","Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza","Tureta","Wamako","Wurno","Yabo"],"Taraba":["Ardo Kola","Bali","Donga","Gashaka","Gassol","Ibi","Jalingo","Karim Lamido","Kumi","Lau","Sardauna","Takum","Ussa","Wukari","Yorro","Zing"],"Yobe":["Bade","Bursari","Damaturu","Fika","Fune","Geidam","Gujba","Gulani","Jakusko","Karasuwa","Machina","Nangere","Nguru","Potiskum","Tarmuwa","Yunusari","Yusufari"],"Zamfara":["Anka","Bakura","Birnin Magaji/Kiyaw","Bukkuyum","Bungudu","Gummi","Gusau","Kaura Namoda","Maradun","Maru","Shinkafi","Talata Mafara","Tsafe","Zurmi"]};

const TYPE_DESCRIPTIONS = {
  business_name: 'Sole proprietorship or partnership. No separate legal entity.',
  private_company: 'Limited liability. Min share capital ₦10,000. At least 1 director.',
  public_company: 'Can raise capital from the public. Min share capital ₦2,000,000. At least 2 directors.',
  guarantee_company: 'No share capital. Members guarantee a nominal amount. Common for NGOs.',
  unlimited_company: 'Members\' liability is not limited.',
  incorporated_trustees: 'For NGOs, churches, associations. Requires at least 2 trustees.',
};

const emptyDir = () => ({ surname:'', firstName:'', otherName:'', dob:'', gender:'MALE', nationality:'NIGERIA', occupation:'', phone:'', email:'', nin:'', idType:'NIN', countryRes:'NIGERIA', resAddress:'' });
const emptySh = () => ({ surname:'', firstName:'', otherName:'', dob:'', gender:'MALE', nationality:'NIGERIA', occupation:'', phone:'', email:'', nin:'', allotted:'', resAddress:'' });
const emptyPsc = () => ({ surname:'', firstName:'', otherName:'', dob:'', gender:'MALE', nationality:'NIGERIA', occupation:'', phone:'', email:'', nin:'', taxResidency:'NIGERIA', tin:'', address:'', resAddress:'', pep:'No', directShares:'', indirectShares:'', directVoting:'', indirectVoting:'', appointDirectors:'Yes', significantInfluence:'No' });
const emptyTrustee = () => ({ surname:'', firstName:'', otherName:'', dob:'', gender:'MALE', nationality:'NIGERIA', occupation:'', phone:'', email:'', nin:'', resAddress:'' });

const SectionHeader = ({ n, label }) => (
  <div className="flex items-center gap-3 mb-4 mt-6 first:mt-0">
    <div className="w-1 h-6 rounded-full bg-[#0A192F] dark:bg-[#D4AF37]" />
    <p className="text-xs font-black text-gray-500 dark:text-slate-400 tracking-wider uppercase">{n}. {label}</p>
  </div>
);

const Field = ({ label, children, className = '' }) => (
  <div className={className}>
    <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">{label}</label>
    {children}
  </div>
);

const inp = 'w-full bg-white dark:bg-[#1E293B] dark:text-white border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A192F] dark:focus:border-[#D4AF37]';

export default function CacRegistrationScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState('form');
  const [regType, setRegType] = useState('');
  const [f, setF] = useState({
    proposedName:'', altName:'', regEmail:'', regPhone:'', natureOfBusiness:'',
    regState:'', regLGA:'', regCity:'', regPostCode:'', regHouse:'', regStreet:'',
    headSame:true, headState:'', headLGA:'', headCity:'', headPostCode:'', headHouse:'', headStreet:'',
    businessType:'Sole Proprietorship', propCommencement:'',
    propSurname:'', propFirstName:'', propOtherName:'', propDOB:'', propGender:'MALE', propNationality:'NIGERIA', propOccupation:'', propPhone:'', propEmail:'', propNIN:'', propResAddress:'',
    authCapital:'100,000', issuedCapital:'100,000', capitalWords:'One Hundred Thousand Naira', shareClass:'ORDINARY', sharesDivided:'100,000', nominalValue:'1.00',
    guaranteeAmount:'10,000', guaranteePurpose:'',
    trusteeCount:3,
    secSurname:'', secFirstName:'', secOtherName:'', secDOB:'', secGender:'FEMALE', secNationality:'NIGERIA', secOccupation:'', secPhone:'', secEmail:'', secNIN:'', secResAddress:'',
    compSurname:'', compFirstName:'', compOtherName:'', compPhone:'', compEmail:'', compAddress:'',
    restrictionReason:'',
  });
  const [directors, setDirectors] = useState([emptyDir()]);
  const [shareholders, setShareholders] = useState([emptySh()]);
  const [pscs, setPscs] = useState([emptyPsc()]);
  const [trustees, setTrustees] = useState([emptyTrustee(), emptyTrustee(), emptyTrustee()]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const states = Object.keys(STATES_LGAS).sort();
  const lgas = f.regState ? (STATES_LGAS[f.regState] || []) : [];
  const headLgas = f.headState ? (STATES_LGAS[f.headState] || []) : [];

  const isCompany = ['private_company','public_company','unlimited_company','guarantee_company'].includes(regType);
  const isBusinessName = regType === 'business_name';
  const isLTDorULT = ['private_company','public_company','unlimited_company'].includes(regType);
  const isGte = regType === 'guarantee_company';
  const isTrustees = regType === 'incorporated_trustees';

  const updateArr = (setter, idx, k, v) => setter(prev => prev.map((item, i) => i === idx ? { ...item, [k]: v } : item));
  const addDir = () => setDirectors(prev => [...prev, emptyDir()]);
  const addSh = () => setShareholders(prev => [...prev, emptySh()]);
  const addPsc = () => setPscs(prev => [...prev, emptyPsc()]);
  const removeAt = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));

  const buildAddr = (prefix) => {
    return `NIGERIA, ${f[prefix+'State']||''}, ${f[prefix+'LGA']||''}, ${f[prefix+'City']||''}, ${f[prefix+'PostCode']||''}, ${f[prefix+'House']||''}, ${f[prefix+'Street']||''}`;
  };

  const buildPayload = () => ({
      user_id: user?.id || 'anonymous',
      registration_type: regType,
      proposed_name: f.proposedName,
      alt_name: f.altName,
      email: f.regEmail,
      phone: f.regPhone,
      nature_of_business: f.natureOfBusiness,
      registered_address: buildAddr('reg'),
      head_office_address: f.headSame ? buildAddr('reg') : buildAddr('head'),
      business_type: f.businessType,
      prop_commencement: f.propCommencement,
      proprietor: { surname:f.propSurname, firstName:f.propFirstName, otherName:f.propOtherName, dob:f.propDOB, gender:f.propGender, nationality:f.propNationality, occupation:f.propOccupation, phone:f.propPhone, email:f.propEmail, nin:f.propNIN, resAddress:f.propResAddress },
      directors, shareholders, pscs, trustees,
      shares: { authCapital:f.authCapital, issuedCapital:f.issuedCapital, capitalWords:f.capitalWords, shareClass:f.shareClass, sharesDivided:f.sharesDivided, nominalValue:f.nominalValue },
      guarantee: { amount:f.guaranteeAmount, purpose:f.guaranteePurpose },
      secretary: { surname:f.secSurname, firstName:f.secFirstName, otherName:f.secOtherName, dob:f.secDOB, gender:f.secGender, nationality:f.secNationality, occupation:f.secOccupation, phone:f.secPhone, email:f.secEmail, nin:f.secNIN, resAddress:f.secResAddress },
      compliance: { surname:f.compSurname, firstName:f.compFirstName, otherName:f.compOtherName, phone:f.compPhone, email:f.compEmail, address:f.compAddress },
      additional: { restrictionReason: f.restrictionReason },
    });

  const downloadPdfCopy = async () => {
    setPdfBusy(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { buildCacPdf, cacPdfFilename } = await import('../lib/cacPdf');
      const input = { ...buildPayload(), id: 'DRAFT', created_at: new Date().toISOString() };
      const doc = buildCacPdf(input, () => new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }));
      doc.save(cacPdfFilename(input));
    } catch (e) {
      alert(`Could not generate the PDF — ${e.message || e}`);
    } finally {
      setPdfBusy(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = buildPayload();
    try {
      const { supabaseInsert } = await import('../services/supabase');
      await supabaseInsert('cac_submissions', payload);
    } catch (e) {
      const key = 'cac_submissions';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift({ ...payload, id: Date.now(), created_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="CAC Registration" onBack={() => { setSubmitted(false); setStep('form'); }} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white mb-1">Submitted!</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Your CAC registration for <span className="font-bold">{f.proposedName}</span> has been submitted. Our team will contact you at <span className="font-bold">{f.regEmail}</span>.</p>
          <button onClick={downloadPdfCopy} disabled={pdfBusy} className="w-full py-4 mb-3 border-2 border-[#0A192F] dark:border-[#D4AF37] text-[#0A192F] dark:text-[#D4AF37] rounded-xl font-bold text-sm disabled:opacity-50">{pdfBusy ? 'Generating PDF…' : 'Download a copy of your application'}</button>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    const Section = ({ label, children }) => (
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3">
        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-1 text-sm">{children}</div>
      </div>
    );
    const Row = ({ k, v }) => v ? <div className="flex justify-between gap-2"><span className="text-gray-500 dark:text-slate-400 shrink-0 text-xs">{k}</span><span className="font-medium text-right text-xs break-all">{v}</span></div> : null;
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="Review Application" onBack={() => setStep('form')} />
        <div className="px-4 pt-4 pb-24 space-y-0">
          <Section label="Basic Details">
            <Row k="Type" v={regType.replace(/_/g,' ')} />
            <Row k="Proposed Name" v={f.proposedName} />
            <Row k="Alt Name" v={f.altName} />
            <Row k="Email" v={f.regEmail} />
            <Row k="Phone" v={f.regPhone} />
            <Row k="Nature" v={f.natureOfBusiness} />
            <Row k="Registered Address" v={buildAddr('reg')} />
            {!f.headSame && <Row k="Head Office" v={buildAddr('head')} />}
          </Section>
          {isBusinessName && <>
            <Section label="Business Type"><Row k="Type" v={f.businessType} /><Row k="Commencement" v={f.propCommencement} /></Section>
            <Section label="Proprietor"><Row k="Name" v={`${f.propSurname} ${f.propFirstName} ${f.propOtherName}`} /><Row k="DOB" v={f.propDOB} /><Row k="NIN" v={f.propNIN} /><Row k="Phone" v={f.propPhone} /><Row k="Email" v={f.propEmail} /><Row k="Occupation" v={f.propOccupation} /><Row k="Address" v={f.propResAddress} /></Section>
          </>}
          {isCompany && directors.length > 0 && <Section label={`Directors (${directors.length})`}>{directors.map((d,i) => <Row key={i} k={`Dir ${i+1}`} v={`${d.surname} ${d.firstName} | NIN: ${d.nin} | ${d.resAddress}`} />)}</Section>}
          {isCompany && shareholders.length > 0 && <Section label={`Shareholders (${shareholders.length})`}>{shareholders.map((s,i) => <Row key={i} k={`SH ${i+1}`} v={`${s.surname} ${s.firstName} | ${s.allotted} shares`} />)}</Section>}
          {isLTDorULT && <Section label="Share Capital"><Row k="Authorized" v={`₦${f.authCapital}`} /><Row k="Issued" v={`₦${f.issuedCapital}`} /><Row k="Words" v={f.capitalWords} /><Row k="Class" v={f.shareClass} /></Section>}
          {isCompany && pscs.length > 0 && <Section label={`PSC (${pscs.length})`}>{pscs.map((p,i) => <Row key={i} k={`PSC ${i+1}`} v={`${p.surname} ${p.firstName} | PEP: ${p.pep} | Shares: ${p.directShares}`} />)}</Section>}
          {isGte && <Section label="Guarantee"><Row k="Amount" v={`₦${f.guaranteeAmount}`} /><Row k="Purpose" v={f.guaranteePurpose} /></Section>}
          {isTrustees && <Section label={`Trustees (${trustees.length})`}>{trustees.map((t,i) => <Row key={i} k={`Trustee ${i+1}`} v={`${t.surname} ${t.firstName} | NIN: ${t.nin}`} />)}</Section>}
          {isCompany && <Section label="Secretary"><Row k="Name" v={`${f.secSurname} ${f.secFirstName} ${f.secOtherName}`} /><Row k="NIN" v={f.secNIN} /><Row k="Phone" v={f.secPhone} /></Section>}
          <Section label="Compliance"><Row k="Name" v={`${f.compSurname} ${f.compFirstName} ${f.compOtherName}`} /><Row k="Phone" v={f.compPhone} /><Row k="Email" v={f.compEmail} /><Row k="Address" v={f.compAddress} /></Section>
          <button onClick={downloadPdfCopy} disabled={pdfBusy} className="w-full py-4 mb-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-300 disabled:opacity-50">{pdfBusy ? 'Generating PDF…' : 'Download PDF of this application'}</button>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setStep('form')} className="flex-1 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-300">Edit</button>
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'Confirm & Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="CAC Registration" onBack={() => navigate(-1)} />
      <div className="px-4 pt-2 pb-24 space-y-4">
        <div className="bg-[#0A192F] dark:bg-[#1E293B] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center"><Building2 className="w-5 h-5 text-[#0A192F]" /></div>
          <div><p className="text-white font-bold text-sm">Complete Registration Portal</p><p className="text-gray-400 text-[10px]">Business Name / Private Ltd / Public Ltd / Ltd/Gte / Unlimited / Inc. Trustees</p></div>
        </div>

        {/* Registration Type */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
          <SectionHeader n="" label="Select Registration Type" />
          <select value={regType} onChange={e => setRegType(e.target.value)} className={inp}>
            <option value="">— Please select —</option>
            <option value="business_name">Business Name (Sole Proprietorship / Partnership)</option>
            <option value="private_company">Private Company Limited by Shares (LTD)</option>
            <option value="public_company">Public Company Limited by Shares (PLC)</option>
            <option value="guarantee_company">Company Limited by Guarantee (LTD/GTE)</option>
            <option value="unlimited_company">Unlimited Company (ULT)</option>
            <option value="incorporated_trustees">Incorporated Trustees (NGO / Association)</option>
          </select>
          {regType && <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">{TYPE_DESCRIPTIONS[regType]}</p>}
        </div>

        {regType && <>
          {/* 1. Basic Details */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
            <SectionHeader n="1" label="Basic Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Proposed Name *"><input className={inp} value={f.proposedName} onChange={e => set('proposedName', e.target.value)} placeholder="e.g. Access Solutions Ltd" /></Field>
              <Field label="Alternative Name"><input className={inp} value={f.altName} onChange={e => set('altName', e.target.value)} placeholder="If first is taken" /></Field>
              <Field label="Email *"><input type="email" className={inp} value={f.regEmail} onChange={e => set('regEmail', e.target.value)} placeholder="you@company.com" /></Field>
              <Field label="Phone *"><input type="tel" className={inp} value={f.regPhone} onChange={e => set('regPhone', e.target.value)} placeholder="08012345678" /></Field>
              <Field label="Nature of Business *" className="sm:col-span-2"><textarea rows={2} className={inp} value={f.natureOfBusiness} onChange={e => set('natureOfBusiness', e.target.value)} placeholder="Describe the business activity" /></Field>
            </div>
          </div>

          {/* 2. Address */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
            <SectionHeader n="2" label="Registered Address" />
            <div className="grid grid-cols-2 gap-3">
              <input value="NIGERIA" readOnly className={`${inp} opacity-60 col-span-2 sm:col-span-1`} />
              <select value={f.regState} onChange={e => { set('regState', e.target.value); set('regLGA', ''); }} className={inp}><option value="">State</option>{states.map(s => <option key={s}>{s}</option>)}</select>
              <select value={f.regLGA} onChange={e => set('regLGA', e.target.value)} className={inp}><option value="">LGA</option>{lgas.map(l => <option key={l}>{l}</option>)}</select>
              <input className={inp} placeholder="City" value={f.regCity} onChange={e => set('regCity', e.target.value)} />
              <input className={inp} placeholder="Postal Code" value={f.regPostCode} onChange={e => set('regPostCode', e.target.value)} />
              <input className={inp} placeholder="House/Building" value={f.regHouse} onChange={e => set('regHouse', e.target.value)} />
              <input className={inp} placeholder="Street" value={f.regStreet} onChange={e => set('regStreet', e.target.value)} />
            </div>
            <label className="flex items-center gap-2 mt-3 cursor-pointer text-xs font-semibold text-gray-700 dark:text-slate-300">
              <input type="checkbox" checked={f.headSame} onChange={e => set('headSame', e.target.checked)} className="rounded accent-[#0A192F] w-4 h-4" />
              Head Office same as Registered
            </label>
            {!f.headSame && (
              <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600">
                <p className="col-span-full text-xs font-semibold text-gray-700 dark:text-slate-300">Head Office Address</p>
                <input value="NIGERIA" readOnly className={`${inp} opacity-60 col-span-2 sm:col-span-1`} />
                <select value={f.headState} onChange={e => { set('headState', e.target.value); set('headLGA', ''); }} className={inp}><option value="">State</option>{states.map(s => <option key={s}>{s}</option>)}</select>
                <select value={f.headLGA} onChange={e => set('headLGA', e.target.value)} className={inp}><option value="">LGA</option>{headLgas.map(l => <option key={l}>{l}</option>)}</select>
                <input className={inp} placeholder="City" value={f.headCity} onChange={e => set('headCity', e.target.value)} />
                <input className={inp} placeholder="Postal" value={f.headPostCode} onChange={e => set('headPostCode', e.target.value)} />
                <input className={inp} placeholder="House/Building" value={f.headHouse} onChange={e => set('headHouse', e.target.value)} />
                <input className={inp} placeholder="Street" value={f.headStreet} onChange={e => set('headStreet', e.target.value)} />
              </div>
            )}
          </div>

          {/* 3. Business Type (Business Name only) */}
          {isBusinessName && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="3" label="Business Type" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Business Type *"><select value={f.businessType} onChange={e => set('businessType', e.target.value)} className={inp}><option>Sole Proprietorship</option><option>Partnership</option></select></Field>
                <Field label="Commencement Date"><input type="date" className={inp} value={f.propCommencement} onChange={e => set('propCommencement', e.target.value)} /></Field>
              </div>
            </div>
          )}

          {/* 4. Proprietor (Business Name only) */}
          {isBusinessName && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="4" label="Proprietor Details" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Surname"><input className={inp} value={f.propSurname} onChange={e => set('propSurname', e.target.value)} /></Field>
                <Field label="First Name"><input className={inp} value={f.propFirstName} onChange={e => set('propFirstName', e.target.value)} /></Field>
                <Field label="Other Name"><input className={inp} value={f.propOtherName} onChange={e => set('propOtherName', e.target.value)} /></Field>
                <Field label="DOB"><input type="date" className={inp} value={f.propDOB} onChange={e => set('propDOB', e.target.value)} /></Field>
                <Field label="Gender"><select value={f.propGender} onChange={e => set('propGender', e.target.value)} className={inp}><option value="MALE">Male</option><option value="FEMALE">Female</option></select></Field>
                <Field label="Occupation"><input className={inp} value={f.propOccupation} onChange={e => set('propOccupation', e.target.value)} /></Field>
                <Field label="Phone"><input type="tel" className={inp} value={f.propPhone} onChange={e => set('propPhone', e.target.value)} /></Field>
                <Field label="Email"><input type="email" className={inp} value={f.propEmail} onChange={e => set('propEmail', e.target.value)} /></Field>
                <Field label="NIN"><input className={inp} value={f.propNIN} onChange={e => set('propNIN', e.target.value)} /></Field>
                <Field label="Residential Address" className="col-span-2"><input className={inp} value={f.propResAddress} onChange={e => set('propResAddress', e.target.value)} placeholder="House, Street, City, LGA, State" /></Field>
              </div>
            </div>
          )}

          {/* 5. Directors (Company types) */}
          {isCompany && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="5" label="Directors" />
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Add at least {regType === 'private_company' ? '1' : '2'} director(s).</p>
              {directors.map((d, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 mb-3">
                  <div className="flex justify-between items-center mb-2"><p className="text-xs font-bold text-gray-600 dark:text-slate-400">Director {i+1}</p>{directors.length > 1 && <button onClick={() => removeAt(setDirectors, i)} className="text-rose-500 text-xs">Remove</button>}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input className={inp} placeholder="Surname" value={d.surname} onChange={e => updateArr(setDirectors, i, 'surname', e.target.value)} />
                    <input className={inp} placeholder="First Name" value={d.firstName} onChange={e => updateArr(setDirectors, i, 'firstName', e.target.value)} />
                    <input className={inp} placeholder="Other Name" value={d.otherName} onChange={e => updateArr(setDirectors, i, 'otherName', e.target.value)} />
                    <input type="date" className={inp} value={d.dob} onChange={e => updateArr(setDirectors, i, 'dob', e.target.value)} />
                    <select className={inp} value={d.gender} onChange={e => updateArr(setDirectors, i, 'gender', e.target.value)}><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
                    <input className={inp} placeholder="Occupation" value={d.occupation} onChange={e => updateArr(setDirectors, i, 'occupation', e.target.value)} />
                    <input type="tel" className={inp} placeholder="Phone" value={d.phone} onChange={e => updateArr(setDirectors, i, 'phone', e.target.value)} />
                    <input type="email" className={inp} placeholder="Email" value={d.email} onChange={e => updateArr(setDirectors, i, 'email', e.target.value)} />
                    <input className={inp} placeholder="NIN / ID No." value={d.nin} onChange={e => updateArr(setDirectors, i, 'nin', e.target.value)} />
                    <select className={inp} value={d.idType} onChange={e => updateArr(setDirectors, i, 'idType', e.target.value)}><option>NIN</option><option>International Passport</option><option>Driver's Licence</option><option>Voter's Card</option></select>
                    <input className={`${inp} col-span-2`} placeholder="Residential Address" value={d.resAddress} onChange={e => updateArr(setDirectors, i, 'resAddress', e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={addDir} className="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> Add Director</button>
            </div>
          )}

          {/* 6. Shareholders */}
          {(isCompany || isGte) && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="6" label="Shareholders / Members" />
              {shareholders.map((s, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 mb-3">
                  <div className="flex justify-between items-center mb-2"><p className="text-xs font-bold text-gray-600 dark:text-slate-400">Shareholder {i+1}</p>{shareholders.length > 1 && <button onClick={() => removeAt(setShareholders, i)} className="text-rose-500 text-xs">Remove</button>}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input className={inp} placeholder="Surname" value={s.surname} onChange={e => updateArr(setShareholders, i, 'surname', e.target.value)} />
                    <input className={inp} placeholder="First Name" value={s.firstName} onChange={e => updateArr(setShareholders, i, 'firstName', e.target.value)} />
                    <input className={inp} placeholder="Other Name" value={s.otherName} onChange={e => updateArr(setShareholders, i, 'otherName', e.target.value)} />
                    <input type="date" className={inp} value={s.dob} onChange={e => updateArr(setShareholders, i, 'dob', e.target.value)} />
                    <select className={inp} value={s.gender} onChange={e => updateArr(setShareholders, i, 'gender', e.target.value)}><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
                    <input className={inp} placeholder="Occupation" value={s.occupation} onChange={e => updateArr(setShareholders, i, 'occupation', e.target.value)} />
                    <input type="tel" className={inp} placeholder="Phone" value={s.phone} onChange={e => updateArr(setShareholders, i, 'phone', e.target.value)} />
                    <input className={inp} placeholder="NIN" value={s.nin} onChange={e => updateArr(setShareholders, i, 'nin', e.target.value)} />
                    <input className={inp} placeholder="Shares Allotted" value={s.allotted} onChange={e => updateArr(setShareholders, i, 'allotted', e.target.value)} />
                    <input className={`${inp} col-span-2`} placeholder="Residential Address" value={s.resAddress} onChange={e => updateArr(setShareholders, i, 'resAddress', e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={addSh} className="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> Add Shareholder</button>
            </div>
          )}

          {/* 7. Share Capital */}
          {isLTDorULT && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="7" label="Share Capital" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Authorized (₦)"><input className={inp} value={f.authCapital} onChange={e => set('authCapital', e.target.value)} /></Field>
                <Field label="Issued (₦)"><input className={inp} value={f.issuedCapital} onChange={e => set('issuedCapital', e.target.value)} /></Field>
                <Field label="Capital in Words"><input className={inp} value={f.capitalWords} onChange={e => set('capitalWords', e.target.value)} /></Field>
                <Field label="Class of Shares"><input className={inp} value={f.shareClass} onChange={e => set('shareClass', e.target.value)} /></Field>
                <Field label="Divided Into"><input className={inp} value={f.sharesDivided} onChange={e => set('sharesDivided', e.target.value)} /></Field>
                <Field label="Nominal Value (₦)"><input className={inp} value={f.nominalValue} onChange={e => set('nominalValue', e.target.value)} /></Field>
              </div>
            </div>
          )}

          {/* 8. PSC */}
          {isCompany && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="8" label="Persons with Significant Control (PSC)" />
              {pscs.map((p, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 mb-3">
                  <div className="flex justify-between items-center mb-2"><p className="text-xs font-bold text-gray-600 dark:text-slate-400">PSC {i+1}</p>{pscs.length > 1 && <button onClick={() => removeAt(setPscs, i)} className="text-rose-500 text-xs">Remove</button>}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input className={inp} placeholder="Surname" value={p.surname} onChange={e => updateArr(setPscs, i, 'surname', e.target.value)} />
                    <input className={inp} placeholder="First Name" value={p.firstName} onChange={e => updateArr(setPscs, i, 'firstName', e.target.value)} />
                    <input type="date" className={inp} value={p.dob} onChange={e => updateArr(setPscs, i, 'dob', e.target.value)} />
                    <select className={inp} value={p.gender} onChange={e => updateArr(setPscs, i, 'gender', e.target.value)}><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
                    <input className={inp} placeholder="Phone" value={p.phone} onChange={e => updateArr(setPscs, i, 'phone', e.target.value)} />
                    <input className={inp} placeholder="NIN" value={p.nin} onChange={e => updateArr(setPscs, i, 'nin', e.target.value)} />
                    <input className={inp} placeholder="TIN" value={p.tin} onChange={e => updateArr(setPscs, i, 'tin', e.target.value)} />
                    <input className={inp} placeholder="Tax Residency" value={p.taxResidency} onChange={e => updateArr(setPscs, i, 'taxResidency', e.target.value)} />
                    <input className={`${inp} col-span-2`} placeholder="Address" value={p.address} onChange={e => updateArr(setPscs, i, 'address', e.target.value)} />
                    <div className="col-span-2 grid grid-cols-2 gap-2 p-2 bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-slate-600">
                      <p className="col-span-2 text-[10px] font-bold text-gray-600 dark:text-slate-400">Interests</p>
                      <Field label="PEP Status"><select className={inp} value={p.pep} onChange={e => updateArr(setPscs, i, 'pep', e.target.value)}><option>No</option><option>Yes</option></select></Field>
                      <Field label="Direct Shares"><input className={inp} value={p.directShares} onChange={e => updateArr(setPscs, i, 'directShares', e.target.value)} placeholder="e.g. 100%" /></Field>
                      <Field label="Direct Voting"><input className={inp} value={p.directVoting} onChange={e => updateArr(setPscs, i, 'directVoting', e.target.value)} placeholder="e.g. 100%" /></Field>
                      <Field label="Appoint Directors"><select className={inp} value={p.appointDirectors} onChange={e => updateArr(setPscs, i, 'appointDirectors', e.target.value)}><option>Yes</option><option>No</option></select></Field>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addPsc} className="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> Add PSC</button>
            </div>
          )}

          {/* 9. Guarantee (Ltd/Gte) */}
          {isGte && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="9" label="Guarantee Details" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Guarantee Amount (₦)"><input className={inp} value={f.guaranteeAmount} onChange={e => set('guaranteeAmount', e.target.value)} /></Field>
                <Field label="Purpose" className="col-span-2"><textarea rows={2} className={inp} value={f.guaranteePurpose} onChange={e => set('guaranteePurpose', e.target.value)} placeholder="Purpose of formation" /></Field>
              </div>
            </div>
          )}

          {/* 10. Trustees (Incorporated Trustees) */}
          {isTrustees && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="10" label="Incorporated Trustees" />
              <Field label="Number of Trustees"><input type="number" min={2} className={inp} value={f.trusteeCount} onChange={e => { const n = Math.max(2, parseInt(e.target.value) || 2); set('trusteeCount', n); while (trustees.length < n) setTrustees(prev => [...prev, emptyTrustee()]); if (trustees.length > n) setTrustees(prev => prev.slice(0, n)); }} /></Field>
              {trustees.map((t, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 mt-3">
                  <p className="text-xs font-bold text-gray-600 dark:text-slate-400 mb-2">Trustee {i+1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input className={inp} placeholder="Surname" value={t.surname} onChange={e => updateArr(setTrustees, i, 'surname', e.target.value)} />
                    <input className={inp} placeholder="First Name" value={t.firstName} onChange={e => updateArr(setTrustees, i, 'firstName', e.target.value)} />
                    <input type="date" className={inp} value={t.dob} onChange={e => updateArr(setTrustees, i, 'dob', e.target.value)} />
                    <select className={inp} value={t.gender} onChange={e => updateArr(setTrustees, i, 'gender', e.target.value)}><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
                    <input className={inp} placeholder="Phone" value={t.phone} onChange={e => updateArr(setTrustees, i, 'phone', e.target.value)} />
                    <input className={inp} placeholder="NIN" value={t.nin} onChange={e => updateArr(setTrustees, i, 'nin', e.target.value)} />
                    <input className={`${inp} col-span-2`} placeholder="Residential Address" value={t.resAddress} onChange={e => updateArr(setTrustees, i, 'resAddress', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 11. Secretary (Company types) */}
          {isCompany && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <SectionHeader n="11" label="Secretary" />
              <div className="grid grid-cols-2 gap-3">
                <input className={inp} placeholder="Surname" value={f.secSurname} onChange={e => set('secSurname', e.target.value)} />
                <input className={inp} placeholder="First Name" value={f.secFirstName} onChange={e => set('secFirstName', e.target.value)} />
                <input className={inp} placeholder="Other Name" value={f.secOtherName} onChange={e => set('secOtherName', e.target.value)} />
                <input type="date" className={inp} value={f.secDOB} onChange={e => set('secDOB', e.target.value)} />
                <select className={inp} value={f.secGender} onChange={e => set('secGender', e.target.value)}><option value="FEMALE">Female</option><option value="MALE">Male</option></select>
                <input className={inp} placeholder="Occupation" value={f.secOccupation} onChange={e => set('secOccupation', e.target.value)} />
                <input type="tel" className={inp} placeholder="Phone" value={f.secPhone} onChange={e => set('secPhone', e.target.value)} />
                <input type="email" className={inp} placeholder="Email" value={f.secEmail} onChange={e => set('secEmail', e.target.value)} />
                <input className={inp} placeholder="NIN" value={f.secNIN} onChange={e => set('secNIN', e.target.value)} />
                <input className={`${inp} col-span-2`} placeholder="Residential Address" value={f.secResAddress} onChange={e => set('secResAddress', e.target.value)} />
              </div>
            </div>
          )}

          {/* 12. Compliance */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
            <SectionHeader n={isCompany ? '12' : isTrustees ? '11' : '5'} label="Statement of Compliance" />
            <div className="grid grid-cols-2 gap-3">
              <input className={inp} placeholder="Surname" value={f.compSurname} onChange={e => set('compSurname', e.target.value)} />
              <input className={inp} placeholder="First Name" value={f.compFirstName} onChange={e => set('compFirstName', e.target.value)} />
              <input className={inp} placeholder="Other Name" value={f.compOtherName} onChange={e => set('compOtherName', e.target.value)} />
              <input type="tel" className={inp} placeholder="Phone" value={f.compPhone} onChange={e => set('compPhone', e.target.value)} />
              <input type="email" className={inp} placeholder="Email" value={f.compEmail} onChange={e => set('compEmail', e.target.value)} />
              <input className={`${inp} col-span-2`} placeholder="Address" value={f.compAddress} onChange={e => set('compAddress', e.target.value)} />
            </div>
          </div>

          {/* 13. Additional */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
            <SectionHeader n={isCompany ? '13' : isTrustees ? '12' : '6'} label="Additional Notes" />
            <Field label="Reason for Restriction of Residential Address (if any)"><textarea rows={2} className={inp} value={f.restrictionReason} onChange={e => set('restrictionReason', e.target.value)} /></Field>
          </div>

          {/* Submit */}
          <button onClick={() => setStep('preview')} disabled={!f.proposedName || !f.regEmail || !f.regPhone} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <Eye className="w-5 h-5" /> Preview & Review
          </button>
        </>}
      </div>
    </div>
  );
}
