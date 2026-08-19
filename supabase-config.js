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
  "4US", "ABDU VEGITABLES VENNALA", "ABDULLA VENNALA", "ADHAYAKADA", "AISWARYA COOL BAR",
  "AJ STORES AMEDA TEMPLE", "AJ STORES KATITHARA", "AJ STORES MLA ROAD", "AJITHA(LOOSE)",
  "AJWA SUPER MARKET", "AKASH STORES", "AKR PANAGAD", "ALI STORES VENNALA", "ALIANS (LOOSE)",
  "ALIF MINI SUPER MARKET MOOLEPADAM", "ALMA BAKERY", "AMALA STORES", "AMBADY", "AMEYA ANANDHU",
  "AMK PANAGAD", "AMMU STORES MOOLEPADAM", "AMMUS STORES JANADHA", "AMMUS STORES, MOOLEPADAM",
  "AN STORES KATITHARA", "AN STORES, KATTITHARA", "ANGADI MART", "ANGEL PROVISIONS THEVARA",
  "ANGEL STORES, KATTITHARA", "ANIL STORES PANAGAD", "ANJAL KATITHARA", "ANJANA MADAVANA",
  "ANJANEYA STORES TRIPUNITURA", "ANNA BAKERY", "ANNADHA(LOOSE)", "ANU STORES", "AR BAKERY (lOOSE)",
  "AR BAKERY PANAGAD", "AREENA", "ARUN BAKERY PANAGAD", "ARUVELIL", "ARYA STORES MLA ROAD",
  "AS METRO MART", "AS PALACHARAKUKADA", "ATLANTIS", "ATLANTIS (LOOSE)", "AV MART TRAPUNITURA",
  "BABU KOTTAYATHUPARA", "BABYS BAKERY NETTOR", "BAKE AND TAKE NETTOR", "BALAN STORES TRIPUNITHURA",
  "BEST BAKERS nr THURUTHY TEMPLE", "BHASI UDHAYAMPEROOR", "BISMI STORES NETTOR", "BISMI STORES UDHAYAMPEROOR",
  "BROWNS BAKERY THEVARA", "CHAKKALAKKAL", "CHARLS STORES NETTOR", "CHEMBU BAKERY, CHEMBUMUKKU",
  "CHOICE BAKERY, TRIPUNITURA", "CKP", "CLASSIK FORT", "CMA", "COLLEGE CANTEEN (LOOSE)",
  "COOP MART, ALINCHUDU", "DAILY HOME NEEDS", "DARSHANA EROOR", "DARSHANA LABOUR JN.",
  "DARSHANA MART EROOR", "DAY TO DAY MINI MART", "DE FRESH", "DEEPAN STORES", "DEVI FANCY",
  "DHYAN STORES TRIPUNITURA", "DIVINE KUMBALAM", "DIVINE MADAVANA", "DQ STORES, KENNADIMUKKU",
  "DREAMS FOOT WEAR NETTOR", "DREAMS STORES, MARADU", "EOS", "EXPRESS VEGITABLES",
  "FAMILY MINI MART THERVARA", "FATHIMA BAKERY NETTOR", "FATHIMA STORES KADAVANTHRA", "FOUR STAR MADAVANA",
  "GAYATHRI ( LOOSE)", "GG MART", "GIRISH", "GK STORES, KRISHNAKUMAR", "GLOBAL FRESH NETTOR",
  "GOWRI STORES MLA ROAD", "GRACE (LOOSE)", "GRAND STORES GANDHI SQUARE", "GREEN FRESH",
  "GREEN KART, ALINCHUDU", "GRK", "GROSERY HUBS, CHEMBUMUKKU", "GURUVAYOOR PAPPADAM, TRIPUNITHURA",
  "HABIT EAT(LOOSE)", "HARISREE STORES TRIPUNITURA", "HEAVENLY BAKERS KATITHARA", "HIGH RANGE",
  "HILLPALACE", "HISHIGHNESS SUPER MARKET TRPT", "HOME MART CHEMBUMUKKU", "HOMES", "HOMEY MART JANADHA",
  "HOMEYMART JANADA", "HOSPITAL SHOP NETTOR", "HOT & COOL", "HOT CUP, VAZHAKALA", "JACKSON THEVARA",
  "JAFER NETTOR", "JAISHA BAKERY", "JALEEL KUNDANOOR", "JANADHA MARGIN", "JASS TRADERS",
  "JEYA BAKERY MULANTHURUTHY", "JEYAN EROOR", "JEYAN NETTOR", "JISHA BAKERY, EROOR", "JJ PROVISIONS",
  "JJOHNS HOSPITALITY", "JOHNS BAKERY KATITHARA", "JOMON JAMES THEVARA", "JOY STORES THEVARA",
  "JOY STORES, NIRAVATH, KUNDANOOR", "JOYS STORES KUMBALAM", "K&K", "KADAKKATIL", "KAIRALI SUPER MARKET",
  "KALABHAM", "KALLUPURAKKAL KATITHARA", "KANNADIYIL", "KANNAKATTU", "KARTHIGA MLA ROAD",
  "KARTHIGA NETTOR", "KAYEES", "KEEDHARAYIL", "KEETHARAYIL STORES KUNDANOOR", "KERALA STORES PANANGAD",
  "KGF, PADIVATTAM", "KINGINI MARADU", "KKAR NETTOR", "KKV CHEMBUMUKKU", "KL 39 (LOOSE) TIRPUNITHURA",
  "KL 39 NETTOR", "KM STORES THEVARA", "KM STORES, TRIPUNITHURA", "KOTHARI SUPER MARKET",
  "KOTTARAM (LOOSE)", "KR STORES, PALARIVATTAM", "KRISHNA (LOOSE)", "KRISHNA KANIYAMPUZHA",
  "KRISHNA STORES (NEW)", "KRISHNA STORES THEVARA FERRY", "KRISHNAKUMAR MARADU", "KRK",
  "KUMAR BAKERS, TRIPUNITURA", "KUMBAGONAM (LOOSE)", "KUMBALAM (LOOSE)", "KUMBALAM (PERUMAL LOOSE)",
  "Kavitha Nettor", "LAKSHADWEEP(LOOSE)", "LAKSHMI STORES, CHEMBUMUKKU", "LALAN PANAGAD",
  "LALS INN GRAND", "LALSON UDHAYAKAVALA", "LATHA STORES KATITHARA", "LEELA FOOD / SIJO",
  "LITTLE MARKET THEVARA", "LOEL BAKERY", "LOTUS PROVISIONS, VAZHAKALA", "MADHA STORES KADAVANTHRA",
  "MADHA STORES KADAVATHRA", "MADHA STORES MARADU", "MADHA VEG. THEVARA", "MAGIC OVEN KADAVANTHRA",
  "MAHADEVA STORES KATITHARA", "MAHENDRAN STORES MLA ROAD", "MALABAR BAKERY VENNALA", "MALABAR KADAVANTHRA",
  "MALABAR STORES KATITHARA", "MALAS, TRIPUNITURA", "MALEKKAD", "MALIAKKAL", "MALLUS KADAVANTHRA",
  "MANI STORES PANAGAD", "MANI STORES PANANGAD", "MARGIN FREE MARKET THEVARA", "MARGIN FREE, THEVARA",
  "MARIA MINI MART KATTITHARA", "MARIA STORES", "MARIYA KUNDANOOR", "MEHRIN STORES VENNALA",
  "METRO MART, PETTAH", "MFM, THEVARA", "MILMA THEVARA", "MINI TEA STALL, PUDHIYA ROAD",
  "MINNUMART MLA ROAD", "MK STORES MADAVANA", "MN", "MT MART NETTOR", "NANDANAM MARADU",
  "NANDHANAM SINI EROOR", "NATHANIYA NETTOR", "NAZAR", "NEPOLIAN NETTOR", "NEW KOTTARAM(LOOSE)",
  "NEW STAR UDHAYAMPEROOR", "NICE BAKERY PANAGAD", "NIRMAL STORES KUNDANOOR", "NISHA STORES MARADU",
  "NISHA SUDEESH, EROOR", "NITHA SUDESH", "NIYA STORES KATITHARA", "NM STORES PANAGAD",
  "ODEES CHIPS, TRIPUNITURA", "OLIPARAMBIL", "OLIVE STORES", "PADMANABAN PANAGAD",
  "PAINACLE, ALINchudu", "PALACE BAKERY", "PALATHINGAL", "PAPILON SUPER STORES", "PAPPA'S",
  "PARTHAS", "PATHEMARI", "PAULY STORES THEVARA", "PDDP (LOOSE)", "PHILOMINA", "PICKZIMART VENNALA",
  "PINACLE STORES", "PK BALAN", "PM STORES", "PONNUS THEVARA", "POORNASREE", "POORNASREE, KATTITHARA",
  "POTTAYIL BHAGAVATHY STORES", "PRAGASAN JANADHA ROAD MARADU", "PRANAVAM CHEMBUMUKKU",
  "PRASANTH THEVARA FERRY", "PRAVELIL KUMBALAM", "PRIDE STORES", "PRIDE STORES KUNDANOOR",
  "PRIME SUPER MARKET THEVARA", "PRINCE STORES", "PRIYA STORES", "PUTHENVEETIL NETTOR",
  "RADHA", "RADHA STORES TRIPUNITURA", "RADHAKRISHNAN EROOR", "RAGAVA STORES KADAVANDHRA",
  "RAHUL STORES UDHAYAMPEROOR", "RAJESH STORES EROOR", "RAVI CHELLUCIRA BHAGAVATHY TEMPLE",
  "RAVI STORES KATITHARA", "RAVI STORES PANAGAD", "REAL STORES", "REYANS", "RIZWAN",
  "ROYAL BAKERS MULANTHURUTHY", "ROYAL BAKERS UDHAYAMPEROOR", "ROYAL BAKERY MARADU", "ROYAL BAKERY, EROOR",
  "ROYAL BAKERY, MARKET ROAD, TRIPUNITURA", "ROYAL NETTOR", "ROYAL STORES KUNDANOOR",
  "ROYAL SUPER MARKET KATHRIKADAVU", "RUBY", "Retail loose (kkshop)", "SABARI STORES MLA ROAD",
  "SAJITH BAKERY PANAGAD", "SAJU STORES", "SAKETH", "SALAM (LOOSE)", "SALIM NETTOR",
  "SAMRUTHI SUPER MARKET", "SAMSU MARADU", "SANDEEP MARADU", "SAROMA STORES", "SATHAR VEG",
  "SB STORES TRIPUNITURA", "SHAJI STORES THEVARA", "SHAMSHU MARADU", "SHARADHA THEVARA",
  "SHIJI BAKERY KATTITHARA", "SHILIKUMAR", "SHILIKUMAR, PUDHIYAROAD", "SHIPYARD", "SHIYAS NETTOR",
  "SHOPY FRESH PANAGAD", "SI BAKERY THEVARA", "SIDDARTH KAKKANAD", "SINDHU NORTH (LOOSE)",
  "SINDHU, CHEMBUMUKKU", "SINI EROOR", "SN GANDHI NAGAR", "SN SUPERMARKET KADAVANTHRA",
  "SP STORES EROOR", "SRECCS", "SREE KRISHNA, NETTOR", "SREE LAKSHMI UDAYAMPEROOR",
  "SREEKRISHNA ENTERPRISES TRIPUNITURA", "SREEKRISHNA KADAVATHRA", "SREEKRISHNA UDHAYATHINVATHIL",
  "SREELAKSHMI (CHATTY KADA) MARADU", "SREELAKSHMI NETTOR (SHIBU)", "SREELAYA STORES NETTOR",
  "SRP", "SS STORES", "ST JOSEPH KADAVANTHRA", "ST MARYS", "ST MARYS MLA ROAD", "ST THOMAS MULANTHURUTHY",
  "ST. MARYS THEVARA", "SUBWAY", "SUDHAGARAN NADAKKAVU", "SUDHARSHAN", "SUJITH THATTUKADA",
  "SUNILKUMAR PUDHIYAROAD", "SUPER BAKERY MATTAMAL THEVARA", "SUPER BAKERY PANAMPILLY NAGAR",
  "SUPER BAKERY PERUMANOOR", "SUVIK, TRIPUNITHURA", "SWAD SWEETS AND SNACKS, TRIPUNITURA",
  "SWAMYS( lOOSE)", "SWEET CORNER KUMBALAM", "Smart Mart Niravath Road", "TBS, ALINchudu",
  "TEA BAY KUMBALAM", "TEA CUP", "THEVARA HOTEL (LOOSE)", "THOMMIS PUDHIYAKAVU", "THOTTATHIL BABU MARADU",
  "TJS NETTOR", "TK SLEEBA", "TKM FRESH MART", "TMART", "TRUE BELL THEVARA", "Tony Thykudam",
  "USHA BTC", "USHA GANDHI SQUARE", "USHA KOTTARAM", "USHA NUCLEUS", "USHA PANDAVAM", "USHA SN PARK",
  "USHAS", "V BAZAR MADAVANA", "VALLUVASSERY KADAVANTHRA", "VASINIO", "VBAZAR MADAVANA",
  "VELAYUDHAN THEVARA", "VELAYUDHAN TRIPUNITURA", "VELIKAGATHU PANAGAD", "VELIYIL STORES", "VICHOOS",
  "VICHOOS KADAVANTHRA", "VIJAYA BAKERY", "VIJAYAN PETTA", "VINAYAGA MLA ROAD", "VYSAKH", "WEONE",
  "WILL  MART KADAVANTHRA", "WILL MART KADAVANTHRA", "WILSON", "ZERA MINIMART"
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
            const clientPayload = DEFAULT_CLIENTS_LIST.map(name => ({
                name,
                pd: 45,
                pa: 55
            }));
            await db.from('clients').insert(clientPayload);
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
