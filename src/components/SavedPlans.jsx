import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Trash2, Calendar, Landmark, MapPin, Layers, Award } from 'lucide-react';

export default function SavedPlans({ onSelectBusiness }) {
  const { user, isDemoMode } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPlans = async () => {
    if (!user) return;
    setLoading(true);

    if (isDemoMode) {
      const saved = JSON.parse(localStorage.getItem('entrevision_simulated_matches') || '[]');
      setPlans(saved);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_matches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      console.error("Error fetching saved plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPlans();
  }, [user]);

  const handleDeletePlan = async (id) => {
    if (isDemoMode) {
      const saved = JSON.parse(localStorage.getItem('entrevision_simulated_matches') || '[]');
      const filtered = saved.filter(p => p.id !== id);
      localStorage.setItem('entrevision_simulated_matches', JSON.stringify(filtered));
      setPlans(filtered);
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_matches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlans(plans.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        Please log in to view your saved business plans.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        Loading your saved plans...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', margin: 0 }}>📂 My Saved Business Plans</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
          Review and compare Venture Khoj suitability results you have saved to your profile.
        </p>
      </div>

      {plans.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px', 
          background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px',
          color: 'var(--text-muted)', fontSize: '13px'
        }}>
          You haven't saved any matching plans yet. Go to the "Venture Wizard" tab, complete the questionnaire, and click "Save Match"!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {plans.map((plan) => {
            const dateStr = new Date(plan.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            });
            const topMatch = plan.matched_businesses?.[0];

            return (
              <div 
                key={plan.id} 
                className="section-card" 
                style={{ 
                  display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', 
                  position: 'relative', border: '1px solid rgba(255,255,255,0.08)', padding: '20px' 
                }}
              >
                
                {/* Delete button */}
                <button
                  type="button"
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  onClick={() => handleDeletePlan(plan.id)}
                  title="Delete saved plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Saved date */}
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Calendar className="w-3.5 h-3.5" /> Saved on {dateStr}
                </span>

                {/* Match Criteria summary */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(99, 102, 241, 0.08)' }}>
                    📍 {plan.tehsil} block
                  </span>
                  <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.08)', color: '#eab308' }}>
                    💰 {plan.capital_range.toUpperCase()} capital
                  </span>
                  <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(34, 197, 94, 0.08)', color: '#22c55e' }}>
                    ⚙️ {plan.skill}
                  </span>
                </div>

                {/* Top Matched Business Details */}
                {topMatch && (
                  <div 
                    style={{ 
                      background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', 
                      border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectBusiness(topMatch)}
                    title="Click to view full detail dossier"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#fff', fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>🏆 {topMatch.name}</strong>
                      <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 'bold' }}>{topMatch.matchPercent}% Fit</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {topMatch.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px', marginTop: '2px' }}>
                      <span>Profit: <strong style={{ color: '#22c55e' }}>{topMatch.monthly_profit_est}/mo</strong></span>
                      <span>Investment: <strong style={{ color: '#fff' }}>{topMatch.investment_range}</strong></span>
                    </div>
                  </div>
                )}

                {/* Secondary matches list */}
                {plan.matched_businesses?.length > 1 && (
                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>OTHER TOP MATCHES:</span>
                    <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {plan.matched_businesses.slice(1, 4).map((b, idx) => (
                        <li key={idx} style={{ cursor: 'pointer' }} onClick={() => onSelectBusiness(b)}>
                          <span style={{ color: 'var(--color-secondary)' }}>{b.name}</span> ({b.matchPercent}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
