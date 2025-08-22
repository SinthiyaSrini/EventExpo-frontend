import React, { useEffect, useMemo, useState, useContext, createContext, useRef } from "react";
const MOCK_SERVICES = [
  {
    id: 1,
    name: "DJ Max",
    category: "DJ",
    price: 5000,
    rating: 4.5,
    location: "Chennai",
    availability: ["2025-08-25", "2025-08-28", "2025-09-02"],
    images: [
      "https://picsum.photos/id/1011/800/400",
      "https://picsum.photos/id/1015/800/400",
      "https://picsum.photos/id/1025/800/400",
    ],
    reviews: [
      { id: 1, user: "Ram", text: "Amazing performance!" },
      { id: 2, user: "Priya", text: "Good vibes." },
      { id: 3, user: "Suriya", text: "Played great sets throughout." },
      { id: 4, user: "Anitha", text: "Highly recommended." },
    ],
  },
  {
    id: 2,
    name: "Click Studios",
    category: "Photographer",
    price: 8000,
    rating: 4.8,
    location: "Bangalore",
    availability: ["2025-08-27", "2025-08-30", "2025-09-05"],
    images: [
      "https://picsum.photos/id/1005/800/400",
      "https://picsum.photos/id/1003/800/400",
      "https://picsum.photos/id/1035/800/400",
    ],
    reviews: [
      { id: 1, user: "Anu", text: "Great pictures!" },
      { id: 2, user: "Vijay", text: "Professional team." },
    ],
  },
  {
    id: 3,
    name: "Taste Hub",
    category: "Caterer",
    price: 12000,
    rating: 4.3,
    location: "Chennai",
    availability: ["2025-08-26", "2025-08-31", "2025-09-07"],
    images: [
      "https://picsum.photos/id/292/800/400",
      "https://picsum.photos/id/292/800/400?grayscale",
      "https://picsum.photos/id/1080/800/400",
    ],
    reviews: [
      { id: 1, user: "Divya", text: "Food was tasty and hygienic." },
      { id: 2, user: "Kiran", text: "On-time service." },
      { id: 3, user: "Meena", text: "Good variety of dishes." },
    ],
  },
];

/* ===========================
   Context
=========================== */
const ServiceContext = createContext(null);
export const useServices = () => {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useServices must be used inside <ServiceProvider>");
  return ctx;
};

function ServiceProvider({ children }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setServices(MOCK_SERVICES);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const value = useMemo(() => ({ services, loading, dark, setDark }), [services, loading, dark]);
  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
}

/* 
   Navbar
*/
function Navbar() {
  const { dark, setDark } = useServices();

  // Keyboard shortcut: press "D" to toggle dark mode
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "d" || e.key === "D") && !e.metaKey && !e.ctrlKey) setDark((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDark]);

  return (
    <div className="navbar" role="navigation" aria-label="Top">
      <strong style={{ fontSize: 18 }}>🎉 EventExpo</strong>
      <div className="row" style={{ alignItems: "center" }}>
        <span className="label">Press <span className="kbd">D</span> for Dark Mode</span>
        <button
          className="button ghost"
          aria-pressed={dark}
          onClick={() => setDark((v) => !v)}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </div>
  );
}

/* 
   Filters + Search
*/
function Filters({ filters, setFilters, search, setSearch }) {
  const [internal, setInternal] = useState(search);
  // debounce
  useEffect(() => {
    const t = setTimeout(() => setSearch(internal), 400);
    return () => clearTimeout(t);
  }, [internal, setSearch]);

  return (
    <div className="container" aria-label="Filters">
      <div className="row" style={{ alignItems: "end" }}>
        <div>
          <div className="label">Search</div>
          <input
            className="input"
            placeholder="Search services..."
            value={internal}
            onChange={(e) => setInternal(e.target.value)}
            aria-label="Search services"
          />
        </div>
        <div>
          <div className="label">Category</div>
          <select
            className="select"
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            aria-label="Filter by category"
          >
            <option value="">All</option>
            <option>DJ</option>
            <option>Photographer</option>
            <option>Caterer</option>
          </select>
        </div>
        <div>
          <div className="label">Location</div>
          <select
            className="select"
            value={filters.location}
            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            aria-label="Filter by location"
          >
            <option value="">All</option>
            <option>Chennai</option>
            <option>Bangalore</option>
          </select>
        </div>
        <div>
          <div className="label">Min Rating: {filters.minRating}</div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            className="input"
            value={filters.minRating}
            onChange={(e) => setFilters((f) => ({ ...f, minRating: Number(e.target.value) }))}
            aria-label="Minimum rating"
          />
        </div>
        <div>
          <div className="label">Max Price: ₹{filters.maxPrice}</div>
          <input
            type="range"
            min="0"
            max="20000"
            step="500"
            className="input"
            value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
            aria-label="Maximum price"
          />
        </div>
      </div>
    </div>
  );
}

/* 
   Service Card Grid
*/
function ServiceGrid({ onSelect, services }) {
  if (!services.length) return <div className="container">No matching services.</div>;
  return (
    <div className="container">
      <div className="grid" role="list">
        {services.map((s) => (
          <article className="card" key={s.id} role="listitem" tabIndex={0} aria-label={`${s.name} card`}>
            <img src={s.images[0]} alt={`${s.name} cover`} />
            <div className="body">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{s.name}</strong>
                <span className="badge">{s.category}</span>
              </div>
              <div className="row" style={{ color: "var(--muted)" }}>
                <span>₹{s.price}</span> • <span>⭐ {s.rating}</span> • <span>{s.location}</span>
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <button className="button" onClick={() => onSelect(s)} aria-label={`Open details for ${s.name}`}>
                  View Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* 
   Reviews (pagination)
*/
function Reviews({ reviews, pageSize = 2 }) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(reviews.length / pageSize);
  const slice = reviews.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => setPage(1), [reviews]); // reset on data change
  return (
    <div>
      <h3>Reviews</h3>
      {slice.map((r) => (
        <p key={r.id}><strong>{r.user}:</strong> {r.text}</p>
      ))}
      <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
        <span className="label">Page {page} / {total}</span>
        <div className="row">
          <button className="button ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <button className="button ghost" onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={page === total}>Next</button>
        </div>
      </div>
    </div>
  );
}

/*
   Availability Calendar (simple)
*/
function Availability({ dates, selected, onSelect }) {
  return (
    <div>
      <h3>Availability</h3>
      <div className="row">
        {dates.map((d) => {
          const isSel = selected === d;
          return (
            <button
              key={d}
              className={`button ${isSel ? "" : "ghost"}`}
              onClick={() => onSelect(d)}
              aria-pressed={isSel}
            >
              {new Date(d).toDateString()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* 
   Booking Flow (3 steps + summary)
*/
function BookingForm({ service, onClose }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    date: "",
    time: "",
    guests: "",
    requirements: "",
    name: "",
    email: "",
  });

  const canStep1 = data.date && data.time;
  const canStep2 = Number(data.guests) > 0;
  const canStep3 = data.name.trim() && /\S+@\S+\.\S+/.test(data.email);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  // Ensure chosen date is one of availability
  const validDate = !data.date || service.availability.includes(data.date);

  return (
    <div>
      {step === 1 && (
        <section>
          <h3>Step 1: Date & Time</h3>
          <div className="row">
            <div>
              <div className="label">Choose available date</div>
              <select
                className="select"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                aria-invalid={!validDate}
              >
                <option value="">-- Select --</option>
                {service.availability.map((d) => (
                  <option value={d} key={d}>{new Date(d).toDateString()}</option>
                ))}
              </select>
              {!validDate && <div style={{ color: "var(--danger)" }}>Pick a listed available date.</div>}
            </div>
            <div>
              <div className="label">Time</div>
              <input
                type="time"
                className="input"
                value={data.time}
                onChange={(e) => setData({ ...data, time: e.target.value })}
              />
            </div>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button ghost" onClick={onClose}>Cancel</button>
            <button className="button" onClick={next} disabled={!canStep1 || !validDate}>Next</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <h3>Step 2: Guests & Requirements</h3>
          <div className="row">
            <div>
              <div className="label">Guests</div>
              <input
                type="number"
                min="1"
                className="input"
                value={data.guests}
                onChange={(e) => setData({ ...data, guests: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">Requirements</div>
              <input
                className="input"
                placeholder="(Optional) Special requests"
                value={data.requirements}
                onChange={(e) => setData({ ...data, requirements: e.target.value })}
              />
            </div>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button ghost" onClick={prev}>Back</button>
            <button className="button" onClick={next} disabled={!canStep2}>Next</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <h3>Step 3: Contact Info</h3>
          <div className="row">
            <div>
              <div className="label">Your Name</div>
              <input
                className="input"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div>
              <div className="label">Email</div>
              <input
                type="email"
                className="input"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button ghost" onClick={prev}>Back</button>
            <button className="button" onClick={next} disabled={!canStep3}>Review</button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section>
          <h3>Summary</h3>
          <table className="table">
            <tbody>
              <tr><td><strong>Service</strong></td><td>{service.name}</td></tr>
              <tr><td><strong>Date</strong></td><td>{new Date(data.date).toDateString()}</td></tr>
              <tr><td><strong>Time</strong></td><td>{data.time}</td></tr>
              <tr><td><strong>Guests</strong></td><td>{data.guests}</td></tr>
              <tr><td><strong>Requirements</strong></td><td>{data.requirements || "-"}</td></tr>
              <tr><td><strong>Name</strong></td><td>{data.name}</td></tr>
              <tr><td><strong>Email</strong></td><td>{data.email}</td></tr>
              <tr><td><strong>Estimated Price</strong></td><td>₹{service.price}</td></tr>
            </tbody>
          </table>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button ghost" onClick={() => setStep(1)}>Edit</button>
            <button
              className="button success"
              onClick={() => {
                alert("✅ Booking Confirmed!");
                onClose();
              }}
            >
              Confirm Booking
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/*
   Service Modal with Carousel
*/
function ServiceModal({ service, onClose }) {
  const [index, setIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    // basic focus trap entry
    const prev = document.activeElement;
    dialogRef.current?.focus();
    return () => prev && prev.focus();
  }, []);

  if (!service) return null;
  const next = () => setIndex((i) => (i + 1) % service.images.length);
  const prev = () => setIndex((i) => (i - 1 + service.images.length) % service.images.length);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${service.name} details`}>
      <div className="modal" ref={dialogRef} tabIndex={-1}>
        <button className="button ghost close" onClick={onClose} aria-label="Close">✕</button>

        <div className="carousel">
          <img src={service.images[index]} alt={`${service.name} image ${index+1}`} />
          <div className="nav">
            <button onClick={prev} aria-label="Previous image">◀</button>
            <button onClick={next} aria-label="Next image">▶</button>
          </div>
        </div>

        <div className="container" style={{ paddingTop: 16 }}>
          <h2 style={{ margin: 0 }}>{service.name}</h2>
          <div className="row" style={{ color: "var(--muted)" }}>
            <span className="badge">{service.category}</span>
            <span>₹{service.price}</span>
            <span>⭐ {service.rating}</span>
            <span>{service.location}</span>
          </div>

          <div className="divider" />

          <Availability dates={service.availability} selected={selectedDate} onSelect={setSelectedDate} />
          <div className="divider" />
          <Reviews reviews={service.reviews} />
          <div className="divider" />

          <BookingForm
            service={service}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

/* 
   Root App
*/
function AppContent() {
  const { services, loading, dark } = useServices();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    minRating: 0,
    maxPrice: 20000,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return services.filter((s) => {
      const okTerm =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term) ||
        s.location.toLowerCase().includes(term);
      const okCat = !filters.category || s.category === filters.category;
      const okLoc = !filters.location || s.location === filters.location;
      const okRating = s.rating >= filters.minRating;
      const okPrice = s.price <= filters.maxPrice;
      return okTerm && okCat && okLoc && okRating && okPrice;
    });
  }, [services, search, filters]);

  return (
    <div className={dark ? "dark" : ""}>
      <Navbar />
      <Filters
        filters={filters}
        setFilters={setFilters}
        search={search}
        setSearch={setSearch}
      />
      {loading ? (
        <div className="container">Loading services…</div>
      ) : (
        <ServiceGrid services={filtered} onSelect={setSelected} />
      )}
      <div className="footer">© {new Date().getFullYear()} EventExpo</div>

      {selected && <ServiceModal service={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <ServiceProvider>
      <AppContent />
    </ServiceProvider>
  );
}
