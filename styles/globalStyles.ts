import { StyleSheet } from 'react-native';

// Global color palette (green theme)
export const Colors = {
  primary: '#2F5233',          // Dark Green
  secondary: '#1B7F5B',        // Medium Green
  background: '#DFF5E3',       // Very Light Green
  cardBackground: '#FFFDF6',   // Off-White
  lightBackground: '#DFF5E3',  // Pale Green
  text: '#2F5233',             // Matches primary
  lightText: '#888',
  white: '#FFF',
  success: '#4CAF50',          // Bright Green
  successDark: '#388E3C',      // Dark Green
  border: '#2F5233',
  inactive: '#E0E0E0',
} as const;

// Common text styles
export const TextStyles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
    alignSelf: 'center',
  },
  headerLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 30,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    color: Colors.primary,
  },
  value: {
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 8,
  },
  link: {
    color: Colors.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  adminLink: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 17,
    color: Colors.lightText,
    fontStyle: 'italic',
  },
});

// Common container styles
export const ContainerStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  signupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.lightBackground,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardLarge: {
    width: '100%',
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
});

// Common button styles
export const ButtonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  smallButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  signoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallButtonText: {
    color: Colors.cardBackground,
    fontSize: 15,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: Colors.cardBackground,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backArrow: {
    position: 'absolute',
    top: 44,
    left: 16,
    zIndex: 10,
    padding: 4,
  },
  backArrowAlt: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  backArrowText: {
    fontSize: 32,
    color: Colors.primary,
  },
  backButtonText: {
    color: Colors.cardBackground,
    fontWeight: '500',
    fontSize: 16,
  },
});

// Common input styles
export const InputStyles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  inputAlt: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
  },
});

// Form styles
export const FormStyles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  customCheckbox: {
    marginRight: 8,
  },
  checkboxIcon: {
    fontSize: 22,
  },
  checkboxLabel: {
    color: Colors.primary,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radio: {
    fontSize: 18,
    color: Colors.primary,
  },
});

// Layout styles
export const LayoutStyles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
});

// Progress tracker styles
export const TrackerStyles = StyleSheet.create({
  trackerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    marginTop: 8,
    width: '100%',
  },
  trackerDivision: {
    flex: 1,
    height: 16,
    backgroundColor: Colors.inactive,
    marginHorizontal: 4,
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    minWidth: 0,
    maxWidth: '25%',
  },
  trackerDivisionActive: {
    backgroundColor: Colors.success,
  },
  trackerDivisionFirst: {
    marginLeft: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  trackerDivisionLast: {
    marginRight: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  trackerLabel: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  trackerLabelActive: {
    color: Colors.successDark,
    fontWeight: 'bold',
  },
});

// Ride request specific styles
export const RideRequestStyles = StyleSheet.create({
  rideContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingTop: 60,
  },
  rideTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 20,
  },
  inputContainer: {
    width: '90%',
    position: 'relative',
    marginBottom: 12,
    zIndex: 1,
  },
  rideInput: {
    width: '100%',
    padding: 10,
    marginBottom: 0,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    fontSize: 16,
    minHeight: 72,
  },
  map: {
    width: '90%',
    height: 300,
    borderRadius: 12,
    marginTop: 10,
  },
  pickupOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
    gap: 10,
  },
  pickupButton: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 5,
  },
  pickupButtonSelected: {
    backgroundColor: Colors.primary,
  },
  pickupButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  pickupButtonTextSelected: {
    color: Colors.cardBackground,
  },
  timePickerButton: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  timePickerButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  suggestionList: {
    width: '100%',
    maxHeight: 120,
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 2,
    zIndex: 1000,
    elevation: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  signoutIcon: {
    fontSize: 22,
    color: Colors.primary,
  },
});

// Current rides specific styles
export const CurrentRidesStyles = StyleSheet.create({
  currentRidesContainer: {
    flex: 1,
    backgroundColor: '#DFF5E3',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  rideList: {
    flex: 1,
    marginTop: 24,
  },
  rideListContent: {
    paddingBottom: 20,
  },
  rideCard: {
    backgroundColor: '#FFFDF6',
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
    // Stronger shadow for both iOS and Android
    elevation: 8, // Android
    shadowColor: '#2F5233',
    shadowOpacity: 0.28, // iOS
    shadowRadius: 20,    // iOS
    shadowOffset: { width: 0, height: 10 }, // iOS
    borderWidth: 2,
    borderColor: '#2F5233',
  },
  pickupSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  pickupInfo: {
    flex: 1,
    marginRight: 12,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cancelButtonDisabled: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  statusLabelBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusItem: {
    alignItems: 'center',
    width: 36,
    flexDirection: 'column',
  },
  statusCircleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: Colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
    marginBottom: 2,
    zIndex: 2,
  },
  statusCircleActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.successDark,
  },
  statusConnector: {
    height: 4,
    backgroundColor: Colors.primary,
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: -2,
    zIndex: 1,
  },
  statusIcon: {
    fontSize: 16,
    marginBottom: 0,
  },
  statusLabel: {
    fontSize: 9,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    width: 36,
    alignSelf: 'center',
  },
});

export const HeaderStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: Colors.background,
  },
  headerButton: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonRounded: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
});

// Senior dashboard specific styles
export const SeniorDashboardStyles = StyleSheet.create({
  navBar: {
    marginBottom: 10,
    alignItems: 'center',
  },
  navBarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  groupContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  groupLabel: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  groupName: {
    fontSize: 15,
    color: Colors.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  cardsGrid: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    marginBottom: 12,
  },
});

// Recurring ride specific styles
export const RecurringRideStyles = StyleSheet.create({
  recurringContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  recurringTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 20,
  },
  recurringInputContainer: {
    width: '90%',
    position: 'relative',
    marginBottom: 12,
    zIndex: 1,
  },
  recurringInput: {
    width: '100%',
    padding: 10,
    marginBottom: 0,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    fontSize: 16,
    minHeight: 72,
  },
  recurringSuggestionList: {
    width: '100%',
    maxHeight: 120,
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 2,
    zIndex: 1000,
    elevation: 5,
    position: 'absolute',
    bottom: 72,
  },
  recurringSuggestionItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  datePickerButton: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
  },
  datePickerButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 15,
    marginTop: 10,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 12,
    paddingVertical: 8,
  },
  dayToggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  dayToggleActive: {
    backgroundColor: Colors.primary,
  },
  dayToggleText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  dayToggleTextActive: {
    color: Colors.cardBackground,
  },
  dayName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  dayNameActive: {
    color: Colors.primary,
  },
  timeButton: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  timeButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCC',
  },
  timeButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  timeButtonTextDisabled: {
    color: '#999',
  },
  recurringSubmitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 24,
    width: '90%',
  },
  recurringSubmitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  recurringSubmitButtonText: {
    color: Colors.cardBackground,
    fontWeight: '700',
    fontSize: 18,
  },
});

// Sign up type specific styles
export const SignUpTypeStyles = StyleSheet.create({
  backArrowText: {
    fontSize: 28,
    color: Colors.primary,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  signUpButtonSelected: {
    backgroundColor: Colors.secondary,
  },
  signUpButtonText: {
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Volunteer signup specific styles
export const VolunteerSignUpStyles = StyleSheet.create({
  volunteerContainer: {
    padding: 20,
    backgroundColor: Colors.background,
    paddingBottom: 60,
  },
  volunteerHeader: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 20,
    marginTop: 60,
    alignSelf: 'center',
  },
  volunteerInput: {
    width: '100%',
    padding: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    fontSize: 14,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    color: Colors.primary,
    alignSelf: 'flex-start',
  },
  question: {
    fontWeight: '500',
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  radioRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioIcon: {
    fontSize: 22,
    marginRight: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: Colors.successDark,
    borderColor: Colors.successDark,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.cardBackground,
  },
  radioLabel: {
    fontSize: 16,
    color: Colors.primary,
  },
  volunteerSubmitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  volunteerSubmitButtonText: {
    color: Colors.cardBackground,
    fontWeight: '600',
    fontSize: 18,
  },
  volunteerBackArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  volunteerBackArrowText: {
    fontSize: 32,
    color: Colors.primary,
  },
  volunteerSignoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volunteerSignoutIcon: {
    fontSize: 22,
    color: Colors.primary,
  },
  photoContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  photoButton: {
    backgroundColor: Colors.successDark,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  photoButtonText: {
    color: Colors.cardBackground,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  photoPreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 10,
  },
  smallPhotoPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 10,
    alignSelf: 'center',
  },
  removePhotoButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 10,
  },
  removePhotoText: {
    color: Colors.cardBackground,
    fontWeight: '500',
    fontSize: 14,
  },
  datePickerText: {
    fontSize: 16,
    paddingVertical: 2,
  },
  datePickerPlaceholder: {
    color: '#999',
  },
  datePickerSelected: {
    color: Colors.primary,
  },
});

// Volunteer Dashboard Styles
export const VolunteerDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  navBar: {
    marginBottom: 30,
    alignItems: 'center',
  },
  navBarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
  signoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  groupLabel: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  groupName: {
    fontSize: 18,
    color: Colors.secondary,
    fontWeight: '600',
    marginTop: 2,
  }
});

export const RideRequestsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  backArrow: {
    position: 'absolute',
    top: 44,
    left: 16,
    zIndex: 10,
    padding: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
    alignSelf: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    color: Colors.primary,
  },
  value: {
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  approveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  contactButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.cardBackground,
    fontWeight: '600',
    fontSize: 15,
  },
  signoutButton: {
    position: 'absolute',
    top: 44,
    right: 16,
    zIndex: 20,
    padding: 6,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signoutIcon: {
    fontSize: 22,
    color: Colors.primary,
  },
});

// Combined common styles export
export const CommonStyles = {
  Colors,
  TextStyles,
  ContainerStyles,
  ButtonStyles,
  InputStyles,
  FormStyles,
  LayoutStyles,
  TrackerStyles,
  RideRequestStyles,
  RideRequestsStyles,
  CurrentRidesStyles,
  HeaderStyles,
  SeniorDashboardStyles,
  RecurringRideStyles,
  SignUpTypeStyles,
  VolunteerSignUpStyles,
  VolunteerDashboardStyles
};

export default CommonStyles;
