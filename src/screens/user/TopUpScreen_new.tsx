/**
 * Parkee-style Top Up/Wallet Screen
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { addBalance } from '../../redux/slices/userSlice';
import { colors, typography, spacing } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

const PAYMENT_METHODS = [
  { id: 'gopay', name: 'GoPay', icon: '🟢', available: true },
  { id: 'ovo', name: 'OVO', icon: '🟣', available: true },
  { id: 'dana', name: 'DANA', icon: '🔵', available: true },
  { id: 'qris', name: 'QRIS', icon: '📱', available: true },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', available: true },
  { id: 'cc', name: 'Credit Card', icon: '💳', available: false },
];

export const TopUpScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { currentUser, balance } = useAppSelector((state) => state.user);

  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('gopay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTopUp = async () => {
    const topUpAmount = parseInt(amount);
    if (!topUpAmount || topUpAmount < 10000) {
      alert('Minimum top up is Rp 10.000');
      return;
    }

    if (topUpAmount > 10000000) {
      alert('Maximum top up is Rp 10.000.000');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      dispatch(addBalance(topUpAmount));
      setIsProcessing(false);
      setAmount('');
      alert(`✅ Top Up Success!\n\nRp ${topUpAmount.toLocaleString('id-ID')} has been added to your balance.`);
      navigation.goBack();
    }, 2000);
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue).toLocaleString('id-ID');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={colors.gradientPrimary} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Up</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Current Balance Card */}
        <Card variant="elevated" style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>
            Rp {(balance || currentUser?.balance || currentUser?.e_wallet_balance || 0).toLocaleString('id-ID')}
          </Text>
          <Badge label="Active" variant="success" size="small" style={styles.activeBadge} />
        </Card>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Amount</Text>
          <Card variant="outlined" style={styles.amountCard}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={colors.gray[400]}
              keyboardType="number-pad"
              value={formatCurrency(amount)}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
            />
          </Card>
          <Text style={styles.amountHint}>Minimum Rp 10.000 - Maximum Rp 10.000.000</Text>
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Amount</Text>
          <View style={styles.quickAmountGrid}>
            {QUICK_AMOUNTS.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountButton,
                  amount === value.toString() && styles.quickAmountButtonActive,
                ]}
                onPress={() => handleQuickAmount(value)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === value.toString() && styles.quickAmountTextActive,
                  ]}
                >
                  {value >= 1000000
                    ? `${value / 1000000}M`
                    : `${value / 1000}K`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Card variant="elevated" style={styles.paymentCard}>
            {PAYMENT_METHODS.map((method, index) => (
              <View key={method.id}>
                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    !method.available && styles.paymentMethodDisabled,
                  ]}
                  onPress={() => method.available && setSelectedMethod(method.id)}
                  disabled={!method.available}
                >
                  <View style={styles.paymentMethodLeft}>
                    <View
                      style={[
                        styles.radioButton,
                        selectedMethod === method.id && styles.radioButtonSelected,
                      ]}
                    >
                      {selectedMethod === method.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text style={styles.paymentIcon}>{method.icon}</Text>
                    <Text style={styles.paymentName}>{method.name}</Text>
                  </View>
                  {!method.available && (
                    <Badge label="Soon" variant="default" size="small" />
                  )}
                </TouchableOpacity>
                {index < PAYMENT_METHODS.length - 1 && (
                  <View style={styles.paymentDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* Summary Card */}
        {amount && parseInt(amount) >= 10000 && (
          <Card variant="filled" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Top Up Amount</Text>
              <Text style={styles.summaryValue}>
                Rp {parseInt(amount).toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Admin Fee</Text>
              <Text style={styles.summaryValue}>Rp 0</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total Payment</Text>
              <Text style={styles.summaryTotalValue}>
                Rp {parseInt(amount).toLocaleString('id-ID')}
              </Text>
            </View>
          </Card>
        )}

        {/* Top Up Button */}
        <Button
          title={isProcessing ? 'Processing...' : 'Top Up Now'}
          onPress={handleTopUp}
          variant="primary"
          size="large"
          fullWidth
          disabled={!amount || parseInt(amount) < 10000 || isProcessing}
          loading={isProcessing}
          style={styles.topUpButton}
        />

        {/* Info Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Top Up Information</Text>
            <Text style={styles.infoText}>
              • Balance will be added instantly after payment{'\n'}
              • No admin fee for all payment methods{'\n'}
              • Secure payment guaranteed{'\n'}
              • 24/7 customer support available
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 36,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceValue: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  activeBadge: {
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  currencyPrefix: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    padding: 0,
  },
  amountHint: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickAmountButton: {
    width: '31%',
    paddingVertical: spacing.md,
  borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quickAmountButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickAmountText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  quickAmountTextActive: {
    color: colors.white,
  },
  paymentCard: {
    padding: 0,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  paymentMethodDisabled: {
    opacity: 0.5,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[400],
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  paymentName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 64,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  summaryTotalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  summaryTotalValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  topUpButton: {
    marginBottom: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
