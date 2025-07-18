import React, { useState } from 'react';
import { CannabisStatusCardProps, CannabisConsumption, CONSUMPTION_METHODS, CannabisEffect } from '../../types/nutrition-game';
import { Card, Button, Badge, Input, Label, Tooltip } from '../../lib/anteacore-bridge';
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
    <Card className={styles.cannabisCard}>
      <Card.Header className={styles.cardHeader}>
        <div className={styles.headerInfo}>
          <Card.Title as="h3" className={styles.cardTitle}>
            <span className={styles.cannabisIcon}>🌿</span>
            Cannabis Status
          </Card.Title>
          {status.isActive && (
            <Badge 
              variant="success" 
              className={styles.activeIndicator}
              icon={<span className={styles.activeDot} />}
            >
              Active
            </Badge>
          )}
        </div>
        
        <Tooltip content="Toggle cannabis tracking">
          <Button 
            size="sm"
            variant="ghost"
            className={styles.toggleButton}
            onClick={onToggleTracking}
          >
            {status.isActive ? '🔇' : '🔔'}
          </Button>
        </Tooltip>
      </Card.Header>

      {/* Compact Status */}
      {status.lastConsumption && (
        <Card.Body className={styles.compactStatus}>
          <div className={styles.statusLine}>
            <div className={styles.consumptionInfo}>
              <Badge variant="secondary" icon={getMethodEmoji(status.lastConsumption.method)}>
                {status.lastConsumption.method.charAt(0).toUpperCase() + status.lastConsumption.method.slice(1)}
              </Badge>
              <Badge variant="info" size="sm">
                {getTimeSinceConsumption()}
              </Badge>
              {status.lastConsumption.thcContent && (
                <Badge variant="warning" size="sm">
                  THC {status.lastConsumption.thcContent}%
                </Badge>
              )}
              {status.lastConsumption.cbdContent && (
                <Badge variant="success" size="sm">
                  CBD {status.lastConsumption.cbdContent}%
                </Badge>
              )}
            </div>
            
            {/* Effects as icons */}
            {status.activeEffects.length > 0 && (
              <div className={styles.effectIcons}>
                {status.activeEffects.map((effect, idx) => (
                  <Tooltip 
                    key={idx}
                    content={`${effect.description} (${effect.percentage > 0 ? '+' : ''}${effect.percentage}%)`}
                  >
                    <Button
                      size="sm"
                      variant={effect.type === 'boost' ? 'success' : 'warning'}
                      className={styles.effectIconButton}
                      onClick={() => {
                        setSelectedEffect(effect);
                        setShowEffectModal(true);
                      }}
                    >
                      {effect.type === 'boost' ? '🚀' : '⚠️'}
                      <span className={styles.effectBadge}>{Math.abs(effect.percentage)}%</span>
                    </Button>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </Card.Body>
      )}

      {/* Add Consumption Form */}
      {showForm ? (
        <Card.Body>
          <form onSubmit={handleSubmit} className={styles.consumptionForm}>
            <div className={styles.formGroup}>
              <Label>Consumption Method</Label>
              <div className={styles.methodButtons}>
                {CONSUMPTION_METHODS.map(m => (
                  <Button
                    key={m}
                    type="button"
                    variant={method === m ? 'primary' : 'outline'}
                    size="sm"
                    className={styles.methodButton}
                    onClick={() => setMethod(m)}
                  >
                    {getMethodEmoji(m)}
                    <span>{m}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <Label htmlFor="thc-content">THC %</Label>
                <Input
                  id="thc-content"
                  type="number"
                  value={thcContent}
                  onChange={(e) => setThcContent(e.target.value)}
                  placeholder="20"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              
              <div className={styles.formGroup}>
                <Label htmlFor="cbd-content">CBD %</Label>
                <Input
                  id="cbd-content"
                  type="number"
                  value={cbdContent}
                  onChange={(e) => setCbdContent(e.target.value)}
                  placeholder="5"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="amount">
                Amount ({method === 'edibles' ? 'mg' : 'grams'})
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={method === 'edibles' ? '10' : '0.5'}
                min="0"
                step="0.1"
              />
            </div>

            <div className={styles.formActions}>
              <Button 
                type="button" 
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Log Consumption
              </Button>
            </div>
          </form>
        </Card.Body>
      ) : (
        <Card.Footer>
          <Button 
            fullWidth
            variant="outline"
            onClick={() => setShowForm(true)}
          >
            + Log New Consumption
          </Button>
        </Card.Footer>
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
    </Card>
  );
};

export default CannabisStatusCard;