// Supabase Connection Configuration, Global Authentication Guard & Auto-Seeding
const SUPABASE_URL = "https://zuygfbthujlnsvytntts.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9mM62UE5l4DgWwrmZ1KluA_2eLXPdat";

// Initialize Supabase Client
{
    const supabaseObj = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
    if (!supabaseObj) {
        console.error("Supabase SDK not loaded! Make sure to import Supabase compat SDK in your HTML.");
    } else {
        window.db = supabaseObj.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

// Global Logout helper
window.logoutUser = function() {
    localStorage.removeItem('iyers_auth_user');
    // Clear persisted selections as well
    localStorage.removeItem('IYERS_PERSIST_ROUTE');
    localStorage.removeItem('IYERS_PERSIST_DRIVER');
    location.reload();
};

// Global Authentication Guard
window.requireAuth = function(portalRole, onAuthSuccess) {
    const userKey = 'iyers_auth_user';
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem(userKey));
    } catch(e) {}

    // Function to check if user has access
    function hasAccess(user) {
        if (!user) return false;
        if (user.role === 'owner') return true; // Owner has root access to all portals
        return user.role === portalRole;
    }

    if (currentUser && hasAccess(currentUser)) {
        // Remove cloaking style if authenticated
        const cloak = document.getElementById('auth-cloak');
        if (cloak) cloak.remove();
        
        // Authenticated! Proceed with portal logic
        if (onAuthSuccess) onAuthSuccess(currentUser);
        return;
    }

    // Not authenticated or role mismatch: hijack body with a login screen
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", () => showLoginScreen(portalRole, onAuthSuccess));
    } else {
        showLoginScreen(portalRole, onAuthSuccess);
    }
};

const DEFAULT_CLIENTS_LIST = [
  { name: "WAMYS( lOOSE)", pd: 40, pa: 55 },
  { name: "KOTTARAM (LOOSE)", pd: 40, pa: 55 },
  { name: "HABIT EAT(LOOSE)", pd: 40, pa: 55 },
  { name: "ATLANTIS (LOOSE)", pd: 45, pa: 55 },
  { name: "KUMBALAM (PERUMAL LOOSE)", pd: 45, pa: 55 },
  { name: "NEW KOTTARAM(LOOSE)", pd: 45, pa: 55 },
  { name: "KKV CHEMBUMUKKU", pd: 45, pa: 55 },
  { name: "MALABAR STORES KATITHARA", pd: 45, pa: 55 },
  { name: "AR BAKERY (lOOSE)", pd: 45, pa: 55 },
  { name: "SHIYAS NETTOR", pd: 45, pa: 55 },
  { name: "MALLUS KADAVANTHRA", pd: 45, pa: 55 },
  { name: "POTTAYIL BHAGAVATHY STORES", pd: 45, pa: 55 },
  { name: "BHASI UDHAYAMPEROOR", pd: 45, pa: 55 },
  { name: "ANIL STORES PANAGAD", pd: 45, pa: 55 },
  { name: "VINAYAGA MLA ROAD", pd: 45, pa: 55 },
  { name: "VICHOOS", pd: 40, pa: 55 },
  { name: "VELIKAGATHU PANAGAD", pd: 45, pa: 55 },
  { name: "JOMON JAMES THEVARA", pd: 45, pa: 55 },
  { name: "SALAM (LOOSE)", pd: 45, pa: 55 },
  { name: "COOP MART, ALINCHUDU", pd: 45, pa: 55 },
  { name: "ALIANS (LOOSE)", pd: 45, pa: 55 },
  { name: "NAZAR", pd: 45, pa: 55 },
  { name: "NATHANIYA NETTOR", pd: 45, pa: 55 },
  { name: "OLIPARAMBIL", pd: 45, pa: 55 },
  { name: "CHARLS STORES NETTOR", pd: 45, pa: 55 },
  { name: "FAMILY MINI MART THERVARA", pd: 45, pa: 55 },
  { name: "MAHENDRAN STORES MLA ROAD", pd: 45, pa: 55 },
  { name: "ARUN BAKERY PANAGAD", pd: 45, pa: 55 },
  { name: "KANNAKATTU", pd: 45, pa: 55 },
  { name: "OLIVE STORES", pd: 45, pa: 55 },
  { name: "TBS, ALINCHUDU", pd: 45, pa: 55 },
  { name: "HOMEYMART JANADA", pd: 45, pa: 55 },
  { name: "PRIYA STORES", pd: 45, pa: 55 },
  { name: "HARISREE STORES TRIPUNITURA", pd: 45, pa: 55 },
  { name: "CLASSIK FORT", pd: 45, pa: 55 },
  { name: "RADHA STORES TRIPUNITURA", pd: 45, pa: 55 },
  { name: "POORNASREE", pd: 45, pa: 55 },
  { name: "KRISHNA STORES THEVARA FERRY", pd: 45, pa: 55 },
  { name: "EOS", pd: 45, pa: 55 },
  { name: "MK STORES MADAVANA", pd: 45, pa: 55 },
  { name: "ANJANA MADAVANA", pd: 45, pa: 55 },
  { name: "MARIA MINI MART KATTITHARA", pd: 45, pa: 55 },
  { name: "DIVINE MADAVANA", pd: 45, pa: 55 },
  { name: "JASS TRADERS", pd: 45, pa: 55 },
  { name: "KRK", pd: 45, pa: 55 },
  { name: "SANDEEP MARADU", pd: 45, pa: 55 },
  { name: "KGF, PADIVATTAM", pd: 45, pa: 55 },
  { name: "KAYEES", pd: 45, pa: 55 },
  { name: "ANU STORES", pd: 45, pa: 55 },
  { name: "RAVI STORES PANAGAD", pd: 45, pa: 55 },
  { name: "MEHRIN STORES VENNALA", pd: 45, pa: 55 },
  { name: "PAINACLE, ALINCHUDU", pd: 45, pa: 55 },
  { name: "SB STORES TRIPUNITURA", pd: 45, pa: 55 },
  { name: "ROYAL SUPER MARKET KATHRIKADAVU", pd: 45, pa: 55 },
  { name: "AJ STORES AMEDA TEMPLE", pd: 45, pa: 55 },
  { name: "SP STORES EROOR", pd: 45, pa: 55 },
  { name: "SREE LAKSHMI UDAYAMPEROOR", pd: 45, pa: 55 },
  { name: "AR BAKERY PANAGAD", pd: 45, pa: 55 },
  { name: "PRIME SUPER MARKET THEVARA", pd: 45, pa: 55 },
  { name: "SABARI STORES MLA ROAD", pd: 45, pa: 55 },
  { name: "KARTHIGA MLA ROAD", pd: 45, pa: 55 },
  { name: "KADAKKATIL", pd: 45, pa: 55 },
  { name: "AJWA SUPER MARKET", pd: 45, pa: 55 },
  { name: "MADHA VEG. THEVARA", pd: 45, pa: 55 },
  { name: "REYANS", pd: 45, pa: 55 },
  { name: "NICE BAKERY PANAGAD", pd: 45, pa: 55 },
  { name: "MALABAR KADAVANTHRA", pd: 45, pa: 55 },
  { name: "JEYAN EROOR", pd: 45, pa: 55 },
  { name: "HOT & COOL", pd: 45, pa: 55 },
  { name: "SWEET CORNER KUMBALAM", pd: 45, pa: 55 },
  { name: "JOY STORES, NIRAVATH, KUNDANOOR", pd: 45, pa: 55 },
  { name: "PONNUS THEVARA", pd: 45, pa: 55 },
  { name: "RAGAVA STORES KADAVANDHRA", pd: 45, pa: 55 },
  { name: "SHOPY FRESH PANAGAD", pd: 45, pa: 55 },
  { name: "SHIPYARD", pd: 45, pa: 50 },
  { name: "MADHA STORES KADAVANTHRA", pd: 45, pa: 55 },
  { name: "SN SUPERMARKET KADAVANTHRA", pd: 45, pa: 55 },
  { name: "KALABHAM", pd: 45, pa: 55 },
  { name: "DQ STORES, KENNADIMUKKU", pd: 45, pa: 55 },
  { name: "VELAYUDHAN TRIPUNITURA", pd: 45, pa: 55 },
  { name: "DREAMS FOOT WEAR NETTOR", pd: 45, pa: 55 },
  { name: "THOMMIS PUDHIYAKAVU", pd: 45, pa: 55 },
  { name: "USHA GANDHI SQUARE", pd: 45, pa: 55 },
  { name: "JALEEL KUNDANOOR", pd: 45, pa: 55 },
  { name: "DARSHANA MART EROOR", pd: 45, pa: 55 },
  { name: "GURUVAYOOR PAPPADAM, TRIPUNITHURA", pd: 45, pa: 55 },
  { name: "SAJU STORES", pd: 45, pa: 55 },
  { name: "SHAJI STORES THEVARA", pd: 45, pa: 55 },
  { name: "NIRMAL STORES KUNDANOOR", pd: 45, pa: 55 },
  { name: "BISMI STORES NETTOR", pd: 45, pa: 55 },
  { name: "USHA SN PARK", pd: 45, pa: 55 },
  { name: "AMMUS STORES JANADHA", pd: 45, pa: 55 },
  { name: "KRISHNA (LOOSE)", pd: 45, pa: 55 },
  { name: "RUBY", pd: 45, pa: 55 },
  { name: "AMALA STORES", pd: 45, pa: 55 },
  { name: "SINDHU, CHEMBUMUKKU", pd: 45, pa: 55 },
  { name: "PALATHINGAL", pd: 45, pa: 55 },
  { name: "SHAMSHU MARADU", pd: 45, pa: 55 },
  { name: "SUDHARSHAN", pd: 45, pa: 55 },
  { name: "RAHUL STORES UDHAYAMPEROOR", pd: 42, pa: 55 },
  { name: "NEPOLIAN NETTOR", pd: 45, pa: 55 },
  { name: "VBAZAR MADAVANA", pd: 45, pa: 55 },
  { name: "ROYAL BAKERY, EROOR", pd: 45, pa: 55 },
  { name: "GG MART", pd: 45, pa: 55 },
  { name: "CHEMBU BAKERY, CHEMBUMUKKU", pd: 45, pa: 55 },
  { name: "LALSON UDHAYAKAVALA", pd: 45, pa: 55 },
  { name: "KM STORES, TRIPUNITHURA", pd: 45, pa: 55 },
  { name: "RADHAKRISHNAN EROOR", pd: 45, pa: 55 },
  { name: "AS METRO MART", pd: 45, pa: 55 },
  { name: "MFM, THEVARA", pd: 45, pa: 55 },
  { name: "FOUR STAR MADAVANA", pd: 45, pa: 55 },
  { name: "SUPER BAKERY PANAMPILLY NAGAR", pd: 45, pa: 55 },
  { name: "SREELAYA STORES NETTOR", pd: 45, pa: 55 },
  { name: "DAILY HOME NEEDS", pd: 45, pa: 55 },
  { name: "GAYATHRI ( LOOSE)", pd: 40, pa: 55 },
  { name: "WILSON", pd: 45, pa: 55 },
  { name: "TMART", pd: 45, pa: 55 },
  { name: "MALABAR BAKERY VENNALA", pd: 45, pa: 55 },
  { name: "SN GANDHI NAGAR", pd: 45, pa: 55 },
  { name: "USHA KOTTARAM", pd: 45, pa: 55 },
  { name: "PARTHAS", pd: 45, pa: 55 },
  { name: "KKAR NETTOR", pd: 45, pa: 55 },
  { name: "HOME MART CHEMBUMUKKU", pd: 45, pa: 55 },
  { name: "ROYAL NETTOR", pd: 45, pa: 55 },
  { name: "JAFER NETTOR", pd: 45, pa: 55 },
  { name: "ALMA BAKERY", pd: 45, pa: 55 },
  { name: "GIRISH", pd: 45, pa: 55 },
  { name: "CHAKKALAKKAL", pd: 45, pa: 55 },
  { name: "HIGH RANGE", pd: 45, pa: 55 },
  { name: "KERALA STORES PANANGAD", pd: 45, pa: 55 },
  { name: "GROSERY HUBS, CHEMBUMUKKU", pd: 45, pa: 55 },
  { name: "AS PALACHARAKUKADA", pd: 45, pa: 55 },
  { name: "VELIYIL STORES", pd: 45, pa: 55 },
  { name: "ADHAYAKADA", pd: 45, pa: 55 },
  { name: "EXPRESS VEGITABLES", pd: 45, pa: 55 },
  { name: "NANDANAM MARADU", pd: 45, pa: 55 },
  { name: "LOTUS PROVISIONS, VAZHAKALA", pd: 45, pa: 55 },
  { name: "ST. MARYS THEVARA", pd: 45, pa: 55 },
  { name: "LALS INN GRAND", pd: 45, pa: 55 },
  { name: "AN STORES KATITHARA", pd: 45, pa: 55 },
  { name: "V BAZAR MADAVANA", pd: 45, pa: 55 },
  { name: "ZERA MINIMART", pd: 45, pa: 55 },
  { name: "AMMU STORES MOOLEPADAM", pd: 45, pa: 55 },
  { name: "JOYS STORES KUMBALAM", pd: 45, pa: 55 },
  { name: "NEW MASJID VENNALA", pd: 45, pa: 55 },
  { name: "DARSHANA LABOUR JN.", pd: 45, pa: 55 },
  { name: "SS STORES", pd: 45, pa: 55 },
  { name: "PAPPA'S", pd: 45, pa: 55 },
  { name: "ST MARYS THEVARA", pd: 45, pa: 55 },
  { name: "LALAN PANAGAD", pd: 45, pa: 55 },
  { name: "HEAVENLY BAKERS KATITHARA", pd: 45, pa: 55 },
  { name: "SREELAKSHMI NETTOR (SHIBU)", pd: 45, pa: 55 },
  { name: "NIYA STORES KATITHARA", pd: 45, pa: 55 },
  { name: "KM STORES THEVARA", pd: 45, pa: 55 },
  { name: "SALIM NETTOR", pd: 45, pa: 55 },
  { name: "MANI STORES PANAGAD", pd: 45, pa: 55 },
  { name: "ST JOSEPH KADAVANTHRA", pd: 45, pa: 55 },
  { name: "ST MARYS MLA ROAD", pd: 45, pa: 55 },
  { name: "ODEES CHIPS, TRIPUNITURA", pd: 45, pa: 55 },
  { name: "HISHIGHNESS SUPER MARKET TRPT", pd: 45, pa: 55 },
  { name: "LATHA STORES KATITHARA", pd: 45, pa: 55 },
  { name: "SRECCS", pd: 45, pa: 55 },
  { name: "SREELAKSHMI (CHATTY KADA) MARADU", pd: 45, pa: 55 },
  { name: "BISMI STORES UDHAYAMPEROOR", pd: 45, pa: 55 },
  { name: "NISHA STORES MARADU", pd: 45, pa: 55 },
  { name: "LAKSHMI STORES, CHEMBUMUKKU", pd: 45, pa: 55 },
  { name: "PRAVELIL KUMBALAM", pd: 45, pa: 55 },
  { name: "ANNA BAKERY", pd: 45, pa: 55 },
  { name: "SUBWAY", pd: 45, pa: 55 },
  { name: "TEA CUP", pd: 45, pa: 55 },
  { name: "JOHNS BAKERY KATITHARA", pd: 45, pa: 55 },
  { name: "HOT CUP, VAZHAKALA", pd: 45, pa: 55 },
  { name: "JJOHNS HOSPITALITY", pd: 45, pa: 55 },
  { name: "GOWRI STORES MLA ROAD", pd: 45, pa: 55 },
  { name: "PUTHENVEETIL NETTOR", pd: 45, pa: 55 },
  { name: "JOY STORES THEVARA", pd: 45, pa: 55 },
  { name: "MALIAKKAL", pd: 45, pa: 55 },
  { name: "SI BAKERY THEVARA", pd: 45, pa: 50 },
  { name: "MINNUMART MLA ROAD", pd: 45, pa: 55 },
  { name: "USHA NUCLEUS", pd: 45, pa: 55 },
  { name: "ANJAL KATITHARA", pd: 45, pa: 55 },
  { name: "ROYAL BAKERY, MARKET ROAD, TRIPUNITURA", pd: 45, pa: 55 },
  { name: "MILMA THEVARA", pd: 45, pa: 55 },
  { name: "CHOICE BAKERY, TRIPUNITURA", pd: 45, pa: 55 },
  { name: "VASINIO", pd: 45, pa: 55 },
  { name: "ANGEL PROVISIONS THEVARA", pd: 45, pa: 55 },
  { name: "VYSAKH", pd: 45, pa: 55 },
  { name: "JANADHA MARGIN", pd: 45, pa: 55 },
  { name: "JEYA BAKERY MULANTHURUTHY", pd: 45, pa: 55 },
  { name: "SAROMA STORES", pd: 45, pa: 55 },
  { name: "LITTLE MARKET THEVARA", pd: 43, pa: 55 },
  { name: "GREEN KART, ALINCHUDU", pd: 45, pa: 55 },
  { name: "SWAD SWEETS AND SNACKS, TRIPUNITURA", pd: 45, pa: 55 },
  { name: "TJS NETTOR", pd: 45, pa: 55 },
  { name: "AV MART TRAPUNITURA", pd: 45, pa: 55 },
  { name: "VIJAYA BAKERY", pd: 45, pa: 55 },
  { name: "DIVINE KUMBALAM", pd: 45, pa: 55 },
  { name: "VIJAYAN PETTA", pd: 45, pa: 55 },
  { name: "SIDDARTH KAKKANAD", pd: 45, pa: 55 },
  { name: "KR STORES, PALARIVATTAM", pd: 45, pa: 55 },
  { name: "BROWNS BAKERY THEVARA", pd: 45, pa: 55 },
  { name: "SREEKRISHNA UDHAYATHINVATHIL", pd: 45, pa: 55 },
  { name: "TKM FRESH MART", pd: 45, pa: 55 },
  { name: "GREEN FRESH", pd: 45, pa: 55 },
  { name: "HILLPALACE", pd: 45, pa: 55 },
  { name: "AJITHA(LOOSE)", pd: 45, pa: 55 },
  { name: "ARYA STORES MLA ROAD", pd: 45, pa: 55 },
  { name: "SHARADHA THEVARA", pd: 45, pa: 55 },
  { name: "SUPER BAKERY PERUMANOOR", pd: 45, pa: 55 },
  { name: "KANNADIYIL", pd: 45, pa: 55 },
  { name: "SREE KRISHNA, NETTOR", pd: 45, pa: 55 },
  { name: "CKP", pd: 45, pa: 55 },
  { name: "JEYAN NETTOR", pd: 45, pa: 55 },
  { name: "HOMES", pd: 45, pa: 55 },
  { name: "VELAYUDHAN THEVARA", pd: 45, pa: 55 },
  { name: "PHILOMINA", pd: 45, pa: 55 },
  { name: "SUDHAGARAN NADAKKAVU", pd: 45, pa: 55 },
  { name: "MAHADEVA STORES KATITHARA", pd: 45, pa: 55 },
  { name: "MINI TEA STALL, PUDHIYA ROAD", pd: 45, pa: 55 },
  { name: "SINDHU NORTH (LOOSE)", pd: 45, pa: 55 },
  { name: "LEELA FOOD / SIJO", pd: 40, pa: 55 },
  { name: "MARGIN FREE, THEVARA", pd: 45, pa: 55 },
  { name: "SHILIKUMAR, PUDHIYAROAD", pd: 45, pa: 55 },
  { name: "ROYAL BAKERY MARADU", pd: 45, pa: 55 },
  { name: "MT MART NETTOR", pd: 45, pa: 55 },
  { name: "RAVI STORES KATITHARA", pd: 45, pa: 55 },
  { name: "CMA", pd: 45, pa: 55 },
  { name: "PADMANABAN PANAGAD", pd: 45, pa: 55 },
  { name: "DEVI FANCY", pd: 45, pa: 55 },
  { name: "SREEKRISHNA ENTERPRISES TRIPUNITURA", pd: 45, pa: 55 },
  { name: "ROYAL BAKERS UDHAYAMPEROOR", pd: 45, pa: 55 },
  { name: "AJ STORES KATITHARA", pd: 45, pa: 55 },
  { name: "ARUVELIL", pd: 45, pa: 55 },
  { name: "SUPER BAKERY MATTAMAL THEVARA", pd: 45, pa: 55 },
  { name: "JJ PROVISIONS", pd: 42, pa: 55 },
  { name: "MARIA STORES", pd: 45, pa: 55 },
  { name: "SINI EROOR", pd: 45, pa: 55 },
  { name: "BAKE AND TAKE NETTOR", pd: 45, pa: 55 },
  { name: "GRK", pd: 45, pa: 55 },
  { name: "THOTTATHIL BABU MARADU", pd: 45, pa: 55 },
  { name: "ANNADHA(LOOSE)", pd: 45, pa: 55 },
  { name: "SATHAR VEG", pd: 45, pa: 55 },
  { name: "PM STORES", pd: 45, pa: 55 },
  { name: "PRASANTH THEVARA FERRY", pd: 45, pa: 55 },
  { name: "SUVIK, TRIPUNITHURA", pd: 45, pa: 55 },
  { name: "GRAND STORES GANDHI SQUARE", pd: 45, pa: 55 },
  { name: "AMBADY", pd: 45, pa: 55 },
  { name: "USHA PANDAVAM", pd: 45, pa: 55 },
  { name: "MALEKKAD", pd: 45, pa: 55 },
  { name: "NITHA SUDESH", pd: 45, pa: 55 },
  { name: "RAJESH STORES EROOR", pd: 45, pa: 55 },
  { name: "PICKZIMART VENNALA", pd: 45, pa: 55 },
  { name: "KINGINI MARADU", pd: 45, pa: 55 },
  { name: "AJ STORES MLA ROAD", pd: 45, pa: 55 },
  { name: "RADHA", pd: 45, pa: 55 },
  { name: "SAKETH", pd: 45, pa: 55 },
  { name: "TK SLEEBA", pd: 45, pa: 55 },
  { name: "PRIDE STORES KUNDANOOR", pd: 45, pa: 55 },
  { name: "KRISHNAKUMAR MARADU", pd: 45, pa: 55 },
  { name: "BABU KOTTAYATHUPARA", pd: 45, pa: 55 },
  { name: "KAIRALI SUPER MARKET", pd: 45, pa: 55 },
  { name: "BABYS BAKERY NETTOR", pd: 45, pa: 55 },
  { name: "BALAN STORES TRIPUNITHURA", pd: 45, pa: 55 },
  { name: "FATHIMA STORES KADAVANTHRA", pd: 45, pa: 55 },
  { name: "ROYAL BAKERS MULANTHURUTHY", pd: 45, pa: 55 },
  { name: "HOSPITAL SHOP NETTOR", pd: 45, pa: 55 },
  { name: "JAISHA BAKERY", pd: 45, pa: 55 },
  { name: "NM STORES PANAGAD", pd: 43, pa: 55 },
  { name: "WILL MART KADAVANTHRA", pd: 45, pa: 55 },
  { name: "LOEL BAKERY", pd: 45, pa: 55 },
  { name: "SAMRUTHI SUPER MARKET", pd: 45, pa: 55 },
  { name: "FATHIMA BAKERY NETTOR", pd: 45, pa: 55 },
  { name: "SAJITH BAKERY PANAGAD", pd: 45, pa: 55 },
  { name: "PAPILON SUPER STORES", pd: 45, pa: 55 },
  { name: "KALLUPURAKKAL KATITHARA", pd: 45, pa: 55 },
  { name: "KUMMAR BAKERS, TRIPUNITURA", pd: 45, pa: 55 },
  { name: "KEETHARAYIL STORES KUNDANOOR", pd: 45, pa: 55 },
  { name: "KARTHIGA NETTOR", pd: 45, pa: 55 },
  { name: "DHYAN STORES TRIPUNITURA", pd: 45, pa: 55 },
  { name: "DAY TO DAY MINI MART", pd: 45, pa: 55 },
  { name: "AISWARYA COOL BAR", pd: 45, pa: 55 },
  { name: "MAGIC OVEN KADAVANTHRA", pd: 45, pa: 55 },
  { name: "ALIF MINI SUPER MARKET MOOLEPADAM", pd: 45, pa: 55 },
  { name: "AKR PANAGAD", pd: 45, pa: 55 },
  { name: "SHIJI BAKERY KATTITHARA", pd: 45, pa: 55 },
  { name: "WEONE", pd: 45, pa: 55 },
  { name: "ANJANEYA STORES TRIPUNITURA", pd: 45, pa: 55 },
  { name: "REAL STORES", pd: 45, pa: 55 },
  { name: "TRUE BELL THEVARA", pd: 45, pa: 55 },
  { name: "ABDU VEGITABLES VENNALA", pd: 45, pa: 55 },
  { name: "COLLEGE CANTEEN (LOOSE)", pd: 40, pa: 55 },
  { name: "KRISHNA KANIYAMPUZHA", pd: 45, pa: 55 },
  { name: "PATHEMARI", pd: 45, pa: 55 },
  { name: "ALI STORES VENNALA", pd: 45, pa: 55 },
  { name: "MN", pd: 45, pa: 55 },
  { name: "PRINCE STORES", pd: 45, pa: 55 },
  { name: "PRAGASAN JANADHA ROAD MARADU", pd: 45, pa: 55 },
  { name: "NEW STAR UDHAYAMPEROOR", pd: 45, pa: 55 },
  { name: "MARIYA KUNDANOOR", pd: 45, pa: 55 },
  { name: "SRP", pd: 45, pa: 55 },
  { name: "RAVI CHELLUCIRA BHAGAVATHY TEMPLE", pd: 42, pa: 55 },
  { name: "AMK PANAGAD", pd: 45, pa: 55 },
  { name: "GLOBAL FRESH NETTOR", pd: 45, pa: 55 },
  { name: "PRANAVAM CHEMBUMUKKU", pd: 45, pa: 55 },
  { name: "KOTHARI SUPER MARKET", pd: 45, pa: 55 },
  { name: "KRISHNA STORES (NEW)", pd: 45, pa: 55 },
  { name: "TEA BAY KUMBALAM", pd: 45, pa: 55 },
  { name: "PAULY STORES THEVARA", pd: 45, pa: 55 },
  { name: "DARSHANA EROOR", pd: 45, pa: 55 },
  { name: "VALLUVASSERY KADAVANTHRA", pd: 45, pa: 55 },
  { name: "SUJITH THATTUKADA", pd: 45, pa: 55 },
  { name: "AREENA", pd: 45, pa: 55 },
  { name: "ST THOMAS MULANTHURUTHY", pd: 45, pa: 55 },
  { name: "K&K", pd: 45, pa: 55 },
  { name: "BEST BAKERS nr THURUTHY TEMPLE", pd: 45, pa: 55 },
  { name: "AMEYA ANANDHU", pd: 45, pa: 55 },
  { name: "JACKSON THEVARA", pd: 45, pa: 55 },
  { name: "HOMEY MART JANADHA", pd: 45, pa: 55 },
  { name: "PRIDE STORES", pd: 45, pa: 55 },
  { name: "KEEDHARAYIL", pd: 45, pa: 55 },
  { name: "SHILIKUMAR", pd: 45, pa: 55 },
  { name: "Retail loose (kkshop)", pd: 45, pa: 55 },
  { name: "MARGIN FREE MARKET THEVARA", pd: 45, pa: 55 },
  { name: "PDDP (LOOSE)", pd: 40, pa: 55 },
  { name: "4US", pd: 45, pa: 55 },
  { name: "KL 39 (LOOSE) TIRPUNITHURA", pd: 45, pa: 55 },
  { name: "KL 39 NETTOR", pd: 45, pa: 55 },
  { name: "MANI STORES PANANGAD", pd: 45, pa: 55 },
  { name: "POORNASREE, KATTITHARA", pd: 45, pa: 55 },
  { name: "KUMBAGONAM (LOOSE)", pd: 45, pa: 55 },
  { name: "KUMBALAM (LOOSE)", pd: 45, pa: 55 },
  { name: "ATLANTIS", pd: 45, pa: 55 },
  { name: "USHAS", pd: 40, pa: 55 },
  { name: "MALAS, TRIPUNITURA", pd: 45, pa: 55 },
  { name: "PALACE BAKERY", pd: 45, pa: 55 },
  { name: "ANGADI MART", pd: 45, pa: 55 },
  { name: "PK BALAN", pd: 45, pa: 55 },
  { name: "DEEPAN STORES", pd: 45, pa: 55 },
  { name: "ROYAL STORES KUNDANOOR", pd: 45, pa: 55 },
  { name: "SAMSU MARADU", pd: 45, pa: 55 },
  { name: "RIZWAN", pd: 45, pa: 55 },
  { name: "AN STORES, KATTITHARA", pd: 45, pa: 55 },
  { name: "ANGEL STORES, KATTITHARA", pd: 45, pa: 55 },
  { name: "MADHA STORES MARADU", pd: 45, pa: 55 },
  { name: "DE FRESH", pd: 45, pa: 55 },
  { name: "GK STORES, KRISHNAKUMAR", pd: 45, pa: 55 },
  { name: "AKASH STORES", pd: 45, pa: 55 },
  { name: "USHA BTC", pd: 45, pa: 55 },
  { name: "DREAMS STORES, MARADU", pd: 45, pa: 55 },
  { name: "METRO MART, PETTAH", pd: 45, pa: 55 },
  { name: "NANDHANAM SINI EROOR", pd: 45, pa: 55 },
  { name: "NISHA SUDEESH, EROOR", pd: 45, pa: 55 },
  { name: "JISHA BAKERY, EROOR", pd: 45, pa: 55 },
  { name: "PINACLE STORES", pd: 45, pa: 55 },
  { name: "ABDULLA VENNALA", pd: 45, pa: 55 },
  { name: "AMMUS STORES, MOOLEPADAM", pd: 45, pa: 55 },
  { name: "Kavitha Nettor", pd: 45, pa: 55 },
  { name: "THEVARA HOTEL (LOOSE)", pd: 45, pa: 55 },
  { name: "LAKSHADWEEP(LOOSE)", pd: 45, pa: 55 },
  { name: "GRACE (LOOSE)", pd: 45, pa: 55 },
  { name: "Tony Thykudam", pd: 45, pa: 55 },
  { name: "Smart Mart Niravath Road", pd: 45, pa: 55 },
  { name: "SREEKRISHNA KADAVATHRA", pd: 45, pa: 55 },
  { name: "VICHOOS KADAVANTHRA", pd: 45, pa: 55 },
  { name: "SUNILKUMAR PUDHIYAROAD", pd: 45, pa: 55 },
  { name: "THANKUS(LOOSE)", pd: 40, pa: 55 },
  { name: "TASTY", pd: 40, pa: 55 },
  { name: "SURENDRAN", pd: 45, pa: 55 },
  { name: "MELEKKAD MLA ROAD", pd: 45, pa: 55 },
  { name: "ZERA PROVISIOND STORES MLA ROAD", pd: 45, pa: 55 },
  { name: "JEEVAN (LOOSE)", pd: 45, pa: 55 },
  { name: "JACOB KADAVANTHRA", pd: 45, pa: 55 },
  { name: "DEVA PROVISIONS STORE PUDHIYAKAVU", pd: 45, pa: 55 },
  { name: "AMMANS SUPER MARKET", pd: 45, pa: 55 },
  { name: "AMMANS FISH MARKET", pd: 45, pa: 55 },
  { name: "AMMANS (UNDER BRIDGE)", pd: 45, pa: 55 },
  { name: "KALA", pd: 55, pa: 60 }
];

// Helper to seed Supabase database if empty
async function checkAndSeedDatabase() {
    try {
        // 1. Seed users if empty
        const { data: userCheck, error: uErr } = await db.from('users').select('username').limit(1);
        if (uErr) {
            console.error("Table 'users' check failed. Ensure migrations are run in Supabase first.", uErr);
            return;
        }
        if (!userCheck || userCheck.length === 0) {
            console.log("Supabase empty! Auto-seeding initial users...");
            await db.from('users').insert([
                { username: "admin", password: "123", role: "owner", name: "Owner" },
                { username: "driver", password: "123", role: "driver", name: "Driver" }
            ]);
        }

        // 2. Seed routes if empty
        const { data: routeCheck } = await db.from('routes').select('name').limit(1);
        if (!routeCheck || routeCheck.length === 0) {
            console.log("Auto-seeding routes...");
            await db.from('routes').insert([
                { name: "Udhayamperoor" },
                { name: "Nettoor" },
                { name: "Kannankulangara" },
                { name: "Vadakkekotta" }
            ]);
        }

        // 3. Seed staff if empty
        const { data: staffCheck } = await db.from('staff').select('name').limit(1);
        if (!staffCheck || staffCheck.length === 0) {
            console.log("Auto-seeding staff...");
            await db.from('staff').insert([
                { name: "Ajomon", type: "DELIVERY", shop: "Common" },
                { name: "Naifu", type: "DELIVERY", shop: "Common" },
                { name: "Abdul Jaleel", type: "DELIVERY", shop: "Common" },
                { name: "Aswin", type: "DELIVERY", shop: "Common" },
                { name: "Sreekumar", type: "DELIVERY", shop: "Common" }
            ]);
        }

        // 4. Seed clients (shops) if empty
        const { data: clientsCheck } = await db.from('clients').select('name').limit(1);
        if (!clientsCheck || clientsCheck.length === 0) {
            console.log("Auto-seeding clients list...");
            await db.from('clients').insert(DEFAULT_CLIENTS_LIST);
        }
    } catch (e) {
        console.error("Auto-seeding error:", e);
    }
}

function showLoginScreen(portalRole, onAuthSuccess) {
    // Remove cloaking style so the login page can display
    const cloak = document.getElementById('auth-cloak');
    if (cloak) cloak.remove();

    // Save original styles/body
    const originalHTML = document.body.innerHTML;
    const originalBG = document.body.style.background;
    
    // Inject dynamic Outfit font
    const fontId = 'iyers-auth-font';
    if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
    }

    // Inject custom CSS for the login screen
    const styleId = 'iyers-login-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            #iyers-login-container {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                display: flex; justify-content: center; align-items: center;
                font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
                z-index: 999999; color: #f8fafc;
            }
            .login-card {
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px; padding: 40px; width: 100%; max-width: 380px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                text-align: center;
                box-sizing: border-box;
            }
            .login-brand {
                font-size: 26px; font-weight: 800; color: #38bdf8; margin-bottom: 6px;
                letter-spacing: -0.5px;
            }
            .login-brand span { color: #f8fafc; font-weight: 400; }
            .login-subtitle {
                font-size: 13px; color: #94a3b8; margin-bottom: 24px;
            }
            .login-role-tag {
                display: inline-block; padding: 5px 12px; border-radius: 12px;
                font-size: 10px; font-weight: 700; text-transform: uppercase;
                letter-spacing: 0.5px; margin-bottom: 24px;
            }
            .role-tag-owner { background: #fce7f3; color: #db2777; }
            .role-tag-production { background: #e0e7ff; color: #4f46e5; }
            .role-tag-driver { background: #dcfce7; color: #16a34a; }
            
            .login-group { text-align: left; margin-bottom: 18px; }
            .login-group label {
                display: block; font-size: 10px; font-weight: 600; color: #94a3b8;
                text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
            }
            .login-input {
                width: 100% !important; padding: 12px 16px !important; border-radius: 10px !important;
                background: rgba(15, 23, 42, 0.8) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important;
                color: #f8fafc !important; font-size: 14px !important; font-weight: 500 !important; transition: all 0.2s !important;
                outline: none !important; box-sizing: border-box !important;
            }
            .login-input:focus {
                border-color: #38bdf8 !important;
                background: rgba(15, 23, 42, 0.9) !important;
                color: #f8fafc !important;
                box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2) !important;
            }
            .login-btn {
                width: 100%; padding: 14px; border-radius: 10px;
                background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
                color: white; font-size: 14px; font-weight: 700; border: none;
                cursor: pointer; transition: all 0.2s; margin-top: 10px;
                box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.3);
            }
            .login-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 10px 15px -3px rgba(2, 132, 199, 0.4);
            }
            .login-btn:active { transform: translateY(1px); }
            .login-error {
                margin-top: 16px; font-size: 12px; color: #f87171; font-weight: 600;
                display: none; padding: 10px; background: rgba(248, 113, 113, 0.1);
                border-radius: 8px; border: 1px solid rgba(248, 113, 113, 0.2);
                text-align: left;
            }
            .login-footer {
                margin-top: 24px; font-size: 10px; color: #64748b;
            }
        `;
        document.head.appendChild(style);
    }

    // Draw the Login form
    document.body.style.background = '#0f172a';
    document.body.innerHTML = `
        <div id="iyers-login-container">
            <div class="login-card">
                <div class="login-brand">IyersFood <span>ERP</span></div>
                <div class="login-subtitle">System Authentication</div>
                <span class="login-role-tag role-tag-${portalRole}">${portalRole} portal</span>
                
                <form id="iyers-login-form" onsubmit="event.preventDefault();">
                    <div class="login-group">
                        <label>Username / User ID</label>
                        <input type="text" id="login-username" class="login-input" placeholder="Enter username..." required autocomplete="username">
                    </div>
                    <div class="login-group">
                        <label>Password</label>
                        <input type="password" id="login-password" class="login-input" placeholder="Enter password..." required autocomplete="current-password">
                    </div>
                    <button type="submit" id="login-submit-btn" class="login-btn">Sign In</button>
                    <div id="login-error-msg" class="login-error"></div>
                </form>
                <div class="login-footer">Protected Enterprise System</div>
            </div>
        </div>
    `;

    // Handlers
    const form = document.getElementById('iyers-login-form');
    const errorMsg = document.getElementById('login-error-msg');
    const submitBtn = document.getElementById('login-submit-btn');

    form.addEventListener('submit', async () => {
        const username = document.getElementById('login-username').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value.trim();
        
        errorMsg.style.display = "none";
        submitBtn.disabled = true;
        submitBtn.innerText = "Authenticating...";

        try {
            // Seed database if empty
            await checkAndSeedDatabase();
            
            // Fetch user credentials from Supabase
            const { data: user, error } = await db.from('users')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .maybeSingle();

            if (error) throw error;
            if (!user) {
                throw new Error("Invalid username or password!");
            }

            if (user.role !== 'owner' && user.role !== portalRole) {
                throw new Error(`Access Denied! Your account is registered for the '${user.role.toUpperCase()}' portal.`);
            }

            // Save user session
            localStorage.setItem('iyers_auth_user', JSON.stringify(user));
            
            // Clean up style
            const style = document.getElementById(styleId);
            if (style) style.remove();
            
            document.body.style.background = originalBG;
            document.body.innerHTML = originalHTML;

            // Reload to initiate normal portal scripts with authenticated session
            location.reload();
        } catch (err) {
            errorMsg.innerText = err.message || "Failed to connect to database.";
            errorMsg.style.display = "block";
            submitBtn.disabled = false;
            submitBtn.innerText = "Sign In";
        }
    });
}
