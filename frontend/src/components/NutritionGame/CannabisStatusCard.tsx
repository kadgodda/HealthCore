import React, { useState } from 'react';
import { CannabisStatusCardProps, CannabisConsumption, CONSUMPTION_METHODS, CannabisEffect } from '../../types/nutrition-game';
import EffectDetailsModal from './EffectDetailsModal';
import styles from './CannabisStatusCard.module.css';

const CannabisStatusCard: React.FC<CannabisStatusCardProps> = ({
  status,
  onUpdate,
  onToggleTracking
}) => {
  const [showForm, setShowForm] = useState(false);
  const [method, setMethod] = useState<CannabisConsumption['method']>('smoking');
  const [thcContent, setThcContent] = useState('');
  const [cbdContent, setCbdContent] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedEffect, setSelectedEffect] = useState<CannabisEffect | null>(null);
  const [showEffectModal, setShowEffectModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const consumption: CannabisConsumption = {
      id: Date.now().toString(),
      timestamp: new Date(),
      method,
      thcContent: thcContent ? parseFloat(thcContent) : undefined,
      cbdContent: cbdContent ? parseFloat(cbdContent) : undefined,
      amount: amount ? parseFloat(amount) : undefined,
      unit: method === 'edibles' ? 'mg' : 'g'
    };
    
    onUpdate(consumption);
    setShowForm(false);
    
    // Reset form
    setThcContent('');
    setCbdContent('');
    setAmount('');
  };

  const getMethodEmoji = (method: CannabisConsumption['method']) => {
    switch (method) {
      case 'smoking': return '🚬';
      case 'vaping': return '💨';
      case 'edibles': return '🍪';
      case 'tincture': return '💧';
      default: return '🌿';
    }
  };

  const getTimeSinceConsumption = () => {
    if (!status.timeSinceConsumption) return null;
    
    const hours = Math.floor(status.timeSinceConsumption / 60);
    const minutes = status.timeSinceConsumption % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <div className={styles.cannabisCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerInfo}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cannabisIcon}>🌿</span>
            Cannabis Status
          </h3>
          {status.isActive && (
            <span className={styles.activeIndicator}>
              <span className={styles.activeDot} />
              Active
            </span>
          )}
        </div>
        
        <button 
          className={styles.toggleButton}
          onClick={onToggleTracking}
          title="Toggle cannabis tracking"
        >
          {status.isActive ? '🔇' : '🔔'}
        </button>
      </div>

      {/* Compact Status */}
      {status.lastConsumption && (
        <div className={styles.compactStatus}>
          <div className={styles.statusLine}>
            <div className={styles.consumptionInfo}>
              <span className={styles.methodIcon}>
                {getMethodEmoji(status.lastConsumption.method)}
              </span>
              <span className={styles.consumptionMethod}>
                {status.lastConsumption.method.charAt(0).toUpperCase() + status.lastConsumption.method.slice(1)}
              </span>
              <span className={styles.consumptionTime}>
                {getTimeSinceConsumption()}
              </span>
              {status.lastConsumption.thcContent && (
                <span className={styles.cannabinoidBadge}>
                  THC {status.lastConsumption.thcContent}%
                </span>
              )}
              {status.lastConsumption.cbdContent && (
                <span className={styles.cannabinoidBadge}>
                  CBD {status.lastConsumption.cbdContent}%
                </span>
              )}
            </div>
            
            {/* Effects as icons */}
            {status.activeEffects.length > 0 && (
              <div className={styles.effectIcons}>
                {status.activeEffects.map((effect, idx) => (
                  <button
                    key={idx}
                    className={`${styles.effectIconButton} ${effect.type === 'boost' ? styles.boost : styles.penalty}`}
                    onClick={() => {
                      setSelectedEffect(effect);
                      setShowEffectModal(true);
                    }}
                    title={`${effect.description} (${effect.percentage > 0 ? '+' : ''}${effect.percentage}%)`}
                  >
                    {effect.type === 'boost' ? '🚀' : '⚠️'}
                    <span className={styles.effectBadge}>{Math.abs(effect.percentage)}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Consumption Form */}
      {showForm ? (
        <form onSubmit={handleSubmit} className={styles.consumptionForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Consumption Method</label>
            <div className={styles.methodButtons}>
              {CONSUMPTION_METHODS.map(m => (
                <button
                  key={m}
                  type="button"
                  className={`${styles.methodButton} ${method === m ? styles.selected : ''}`}
                  onClick={() => setMethod(m)}
                >
                  {getMethodEmoji(m)}
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>THC %</label>
              <input
                type="number"
                className={styles.formInput}
                value={thcContent}
                onChange={e => setThcContent(e.target.value)}
                placeholder="20"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>CBD %</label>
              <input
                type="number"
                className={styles.formInput}
                value={cbdContent}
                onChange={e => setCbdContent(e.target.value)}
                placeholder="5"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Amount ({method === 'edibles' ? 'mg' : 'grams'})
            </label>
            <input
              type="number"
              className={styles.formInput}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={method === 'edibles' ? '10' : '0.5'}
              min="0"
              step="0.1"
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Log Consumption
            </button>
          </div>
        </form>
      ) : (
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + Log New Consumption
        </button>
      )}
      
      {/* Effect Details Modal */}
      <EffectDetailsModal
        effect={selectedEffect}
        isOpen={showEffectModal}
        onClose={() => {
          setShowEffectModal(false);
          setSelectedEffect(null);
        }}
      />
    </div>
  );
};

export default CannabisStatusCard;