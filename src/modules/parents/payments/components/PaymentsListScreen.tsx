import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';

const PaymentsListScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025');

  const payments = [
    {
      id: 1,
      tripCode: "VR-2025-001",
      destination: "Cusco - Machu Picchu",
      totalAmount: 1200.00,
      paidAmount: 900.00,
      pendingAmount: 300.00,
      currency: "S/",
      status: "partial",
      dueDate: "2025-03-10",
      installments: [
        { number: 1, amount: 400, status: "paid", dueDate: "2025-01-15", paidDate: "2025-01-12" },
        { number: 2, amount: 400, status: "paid", dueDate: "2025-02-15", paidDate: "2025-02-10" },
        { number: 3, amount: 100, status: "paid", dueDate: "2025-02-28", paidDate: "2025-02-25" },
        { number: 4, amount: 300, status: "pending", dueDate: "2025-03-10", paidDate: null }
      ],
      year: "2025"
    },
    {
      id: 2,
      tripCode: "VR-2025-002",
      destination: "Iquitos - Amazonia",
      totalAmount: 950.00,
      paidAmount: 0.00,
      pendingAmount: 950.00,
      currency: "S/",
      status: "pending",
      dueDate: "2025-04-15",
      installments: [
        { number: 1, amount: 350, status: "pending", dueDate: "2025-03-20", paidDate: null },
        { number: 2, amount: 300, status: "pending", dueDate: "2025-04-10", paidDate: null },
        { number: 3, amount: 300, status: "pending", dueDate: "2025-04-15", paidDate: null }
      ],
      year: "2025"
    },
    {
      id: 3,
      tripCode: "VR-2024-015",
      destination: "Arequipa - Colca",
      totalAmount: 800.00,
      paidAmount: 800.00,
      pendingAmount: 0.00,
      currency: "S/",
      status: "completed",
      dueDate: null,
      installments: [
        { number: 1, amount: 400, status: "paid", dueDate: "2024-11-15", paidDate: "2024-11-10" },
        { number: 2, amount: 400, status: "paid", dueDate: "2024-12-15", paidDate: "2024-12-12" }
      ],
      year: "2024"
    }
  ];

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'partial', label: 'Parciales' },
    { key: 'completed', label: 'Completados' }
  ];

  const years = ['2025', '2024', '2023'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'partial': return '#FF9800';
      case 'pending': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'partial': return 'Parcial';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = selectedFilter === 'all' || payment.status === selectedFilter;
    const matchesYear = payment.year === selectedYear;
    return matchesFilter && matchesYear;
  });

  const renderPaymentCard = ({ item }: { item: any }) => {
    const completionPercentage = (item.paidAmount / item.totalAmount) * 100;
    const nextDueInstallment = item.installments.find((inst: any) => inst.status === 'pending');
    const daysUntilDue = nextDueInstallment && nextDueInstallment.dueDate ? getDaysUntilDue(nextDueInstallment.dueDate) : null;

    return (
      <TouchableOpacity style={styles.paymentCard}>
        {/* Header */}
        <View style={styles.paymentHeader}>
          <View style={styles.paymentMainInfo}>
            <Text style={styles.tripCode}>{item.tripCode}</Text>
            <Text style={styles.destination}>{item.destination}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(item.totalAmount, item.currency)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pagado:</Text>
            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
              {formatCurrency(item.paidAmount, item.currency)}
            </Text>
          </View>
          {item.pendingAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pendiente:</Text>
              <Text style={[styles.summaryValue, { color: '#f44336' }]}>
                {formatCurrency(item.pendingAmount, item.currency)}
              </Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso de pagos</Text>
            <Text style={styles.progressPercentage}>{completionPercentage.toFixed(0)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${completionPercentage}%`, 
                  backgroundColor: getStatusColor(item.status) 
                }
              ]} 
            />
          </View>
        </View>

        {/* Next Payment Alert */}
        {nextDueInstallment && (
          <View style={styles.nextPaymentSection}>
            <View style={styles.nextPaymentHeader}>
              <Text style={styles.nextPaymentLabel}>Próximo pago:</Text>
              {daysUntilDue !== null && (
                <View style={[
                  styles.daysAlert, 
                  { backgroundColor: daysUntilDue <= 3 ? '#ffebee' : '#e8f5e8' }
                ]}>
                  <Text style={[
                    styles.daysAlertText,
                    { color: daysUntilDue <= 3 ? '#f44336' : '#4CAF50' }
                  ]}>
                    {daysUntilDue > 0 ? `${daysUntilDue} días` : 'Vencido'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.nextPaymentAmount}>
              {formatCurrency(nextDueInstallment.amount, item.currency)}
            </Text>
            <Text style={styles.nextPaymentDate}>
              Vence: {formatDate(nextDueInstallment.dueDate)}
            </Text>
          </View>
        )}

        {/* Installments Summary */}
        <View style={styles.installmentsSection}>
          <Text style={styles.installmentsTitle}>
            Cuotas ({item.installments.filter((i: any) => i.status === 'paid').length}/{item.installments.length})
          </Text>
          <View style={styles.installmentsList}>
            {item.installments.map((installment: any, index: number) => (
              <View key={index} style={styles.installmentItem}>
                <View style={[
                  styles.installmentDot,
                  { backgroundColor: installment.status === 'paid' ? '#4CAF50' : '#e0e0e0' }
                ]} />
                <View style={styles.installmentInfo}>
                  <Text style={styles.installmentNumber}>Cuota {installment.number}</Text>
                  <Text style={styles.installmentAmount}>
                    {formatCurrency(installment.amount, item.currency)}
                  </Text>
                </View>
                <Text style={[
                  styles.installmentStatus,
                  { color: installment.status === 'paid' ? '#4CAF50' : '#666' }
                ]}>
                  {installment.status === 'paid' ? '✓ Pagado' : 'Pendiente'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>Ver Detalles</Text>
          </TouchableOpacity>
          
          {item.status !== 'completed' && (
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={styles.secondaryButtonText}>Registrar Pago</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pagos</Text>
        <Text style={styles.subtitle}>Gestiona tus pagos de viajes escolares</Text>
      </View>

      {/* Filters and Year Selector */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Year Selector */}
          <View style={styles.yearSelector}>
            <Text style={styles.yearLabel}>Año:</Text>
            {years.map(year => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearButton,
                  selectedYear === year && styles.activeYearButton
                ]}
                onPress={() => setSelectedYear(year)}
              >
                <Text style={[
                  styles.yearText,
                  selectedYear === year && styles.activeYearText
                ]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Status Filters */}
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilterButton
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Total del Año</Text>
          <Text style={styles.summaryCardAmount}>S/ 2,150.00</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Pagado</Text>
          <Text style={[styles.summaryCardAmount, { color: '#4CAF50' }]}>S/ 900.00</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Pendiente</Text>
          <Text style={[styles.summaryCardAmount, { color: '#f44336' }]}>S/ 1,250.00</Text>
        </View>
      </View>

      {/* Payments List */}
      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.paymentsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💳</Text>
            <Text style={styles.emptyStateTitle}>No hay pagos</Text>
            <Text style={styles.emptyStateText}>
              No tienes pagos registrados para este filtro y año seleccionado
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  filtersContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  yearLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  yearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  activeYearButton: {
    backgroundColor: '#e3f2fd',
  },
  yearText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeYearText: {
    color: '#d62d28',
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeFilterButton: {
    backgroundColor: '#d62d28',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryCardTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryCardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  paymentMainInfo: {
    flex: 1,
  },
  tripCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d62d28',
    marginBottom: 4,
  },
  destination: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentSummary: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  nextPaymentSection: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  nextPaymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nextPaymentLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  daysAlert: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  daysAlertText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  nextPaymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  nextPaymentDate: {
    fontSize: 12,
    color: '#666',
  },
  installmentsSection: {
    marginBottom: 16,
  },
  installmentsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  installmentsList: {
    gap: 8,
  },
  installmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  installmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  installmentInfo: {
    flex: 1,
  },
  installmentNumber: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  installmentAmount: {
    fontSize: 12,
    color: '#666',
  },
  installmentStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#d62d28',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});

export default PaymentsListScreen;