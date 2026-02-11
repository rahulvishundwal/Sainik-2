const API = "/api";

/* ======================
   SLIDER
====================== */
function Slider() {
  return (
    <div className="slider">
      <div className="slider-content">
        <h1>Sainik Defense College</h1>
        <p>Discipline • Dedication • Academic Excellence</p>
      </div>
    </div>
  );
}

/* ======================
   NEWS (PUBLIC VIEW)
====================== */
function News() {
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API}/news`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
      })
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="news-panel"><p>Loading news...</p></div>;
  if (error) return <div className="news-panel"><p>Error: {error}</p></div>;

  return (
    <div className="news-panel">
      <h3>📰 News Bulletin</h3>
      {news.length === 0 ? (
        <p>No news available</p>
      ) : (
        news.map(n => (
          <div key={n.id} className="news-item">
            <strong>{n.title}</strong>
            <p>{n.content}</p>
            <small>{new Date(n.date).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

/* ======================
   HOME PAGE
====================== */
function Home() {
  return (
    <>
      <Slider />
      <div className="home-layout">
        <div className="main-content">
          <h2>Welcome to Sainik Defense College</h2>
          <p className="subtitle">Discipline • Dedication • Academic Excellence</p>
          <div className="welcome-text">
            <p>
              Sainik Defense College, Hingonia, Jaipur is committed to providing quality education
              with a focus on discipline, character building, and academic excellence.
            </p>
            <p>
              Our institution prepares young minds for a bright future through a perfect blend of
              academic rigor and co-curricular activities.
            </p>
          </div>
        </div>
        <News />
      </div>
    </>
  );
}

/* ======================
   ADMIN LOGIN
====================== */
function AdminLogin({ onSuccess }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        onSuccess();
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-box">
        <h3>🔐 Admin Login</h3>
        <p className="subtitle">Sainik Defense College</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ======================
   EDIT NEWS PANEL
====================== */
function EditNews() {
  const token = localStorage.getItem("token");
  const [news, setNews] = React.useState([]);
  const [form, setForm] = React.useState({ id: null, title: "", content: "" });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const loadNews = async () => {
    try {
      const res = await fetch(`${API}/news`);
      const data = await res.json();
      setNews(data);
    } catch (err) {
      setMessage("Error loading news");
    }
  };

  React.useEffect(() => {
    loadNews();
  }, []);

  const saveNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = form.id 
        ? `${API}/admin/news/${form.id}` 
        : `${API}/admin/news`;
      
      const method = form.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: form.title, content: form.content })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(form.id ? "✅ News updated successfully!" : "✅ News created successfully!");
        setForm({ id: null, title: "", content: "" });
        loadNews();
      } else {
        setMessage("❌ " + (data.error || "Failed to save news"));
      }
    } catch (err) {
      setMessage("❌ Connection error");
    } finally {
      setLoading(false);
    }
  };

  const edit = (n) => {
    setForm({ id: n.id, title: n.title, content: n.content });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this news?")) return;

    try {
      const res = await fetch(`${API}/admin/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setMessage("✅ News deleted successfully!");
        loadNews();
      } else {
        setMessage("❌ Failed to delete news");
      }
    } catch (err) {
      setMessage("❌ Connection error");
    }
  };

  const cancelEdit = () => {
    setForm({ id: null, title: "", content: "" });
    setMessage("");
  };

  return (
    <div className="admin-content">
      <div className="admin-box">
        <h3>🛠️ {form.id ? "Edit News" : "Add News"}</h3>

        {message && (
          <div className={message.includes("✅") ? "success-message" : "error-message"}>
            {message}
          </div>
        )}

        <form onSubmit={saveNews}>
          <input
            type="text"
            placeholder="News Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            disabled={loading}
          />

          <textarea
            placeholder="News Content"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            required
            disabled={loading}
            rows="5"
          />

          <div className="button-group">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : (form.id ? "Update News" : "Add News")}
            </button>
            
            {form.id && (
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-box">
        <h3>📋 All News ({news.length})</h3>

        {news.length === 0 ? (
          <p>No news available. Create your first news item above.</p>
        ) : (
          <div className="news-list">
            {news.map(n => (
              <div key={n.id} className="news-item-admin">
                <div className="news-info">
                  <strong>{n.title}</strong>
                  <p>{n.content}</p>
                  <small>{new Date(n.date).toLocaleString()}</small>
                </div>
                <div className="news-actions">
                  <button onClick={() => edit(n)} className="btn-edit">
                    ✏️ Edit
                  </button>
                  <button onClick={() => remove(n.id)} className="btn-delete">
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================
   ADMIN DASHBOARD
====================== */
function AdminDashboard() {
  const [tab, setTab] = React.useState("news");

  const logout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">Admin Dashboard</div>
        <div className="nav-links">
          <span 
            onClick={() => setTab("home")} 
            className={tab === "home" ? "active" : ""}
          >
            🏠 Home
          </span>
          <span 
            onClick={() => setTab("news")} 
            className={tab === "news" ? "active" : ""}
          >
            📰 News Bulletin
          </span>
          <span onClick={logout} className="logout-btn">
            🚪 Logout
          </span>
        </div>
      </nav>

      <div className="dashboard-container">
        {tab === "home" && <Home />}
        {tab === "news" && <EditNews />}
      </div>
    </>
  );
}

/* ======================
   APP ROOT
====================== */
function App() {
  const [isAdmin, setIsAdmin] = React.useState(!!localStorage.getItem("token"));

  return (
    <div className="app">
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <AdminLogin onSuccess={() => setIsAdmin(true)} />
      )}
    </div>
  );
}

// Mount React App
ReactDOM.createRoot(document.getElementById("app-root")).render(<App />);
