import { StyleSheet } from 'react-native';

// Global color palette
export const Colors = {
  primary: '#1E3A8A',          // Deep Blue
  secondary: '#2563EB',        // Medium Blue
  background: '#F0F6FF',       // Very Light Blue
  cardBackground: '#FFFFFF',   // White
  lightBackground: '#DBEAFE',  // Pale Blue
  text: '#1E3A8A',             // Matches primary
  lightText: '#888',
  white: '#FFF',
  success: '#3B82F6',          // Bright Blue
  successDark: '#1D4ED8',      // Darker Blue
  border: '#1E3A8A',
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
    backgroundColor: Colors.cardBackground,
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
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
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
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  inputAlt: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
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
};

export default CommonStyles;
