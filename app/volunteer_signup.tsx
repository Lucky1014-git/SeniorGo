import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function VolunteerSignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    hasLicense: '',
    licenseNumber: '',
    hasVehicle: '',
    vehicleType: '',
    proof: '',
    backgroundCheck: '',
    volunteeredBefore: '',
    firstAid: '',
    mobilityHelp: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: any) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    // Age validation
    if (form.dob) {
      // Parse MM/DD/YYYY
      const parts = form.dob.split('/');
      if (parts.length !== 3) {
        Alert.alert('Invalid Date', 'Please enter your date of birth in MM/DD/YYYY format.');
        return;
      }
      const [month, day, year] = parts.map(Number);
      const dob = new Date(year, month - 1, day);
      if (isNaN(dob.getTime())) {
        Alert.alert('Invalid Date', 'Please enter a valid date of birth in MM/DD/YYYY format.');
        return;
      }
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 16) {
        Alert.alert('Age Restriction', 'You must be at least 16 years old to volunteer.');
        return;
      }
    } else {
      Alert.alert('Date of Birth Required', 'Please enter your date of birth.');
      return;
    }
    // License number required
    if (!form.licenseNumber || form.licenseNumber.trim() === '') {
      Alert.alert('License Number Required', 'Please enter your driver’s license number.');
      return;
    }
    setSubmitting(true);
    try {
      console.log('Submitting form:', JSON.stringify(form));
      const response = await fetch('http://10.0.0.24:5000/signUpVolunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        router.replace('/');
      } else {
        Alert.alert('Error', data.message || 'Failed to create account.');
      }
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'Could not connect to server.');
    }
    setSubmitting(false);
  };

  const YesNo = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
    <View style={styles.radioRow}>
      <TouchableOpacity onPress={() => onChange('yes')} style={styles.radioOption}>
        <Text style={styles.radioIcon}>{value === 'yes' ? '🔘' : '⭕'}</Text>
        <Text style={styles.radioLabel}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange('no')} style={styles.radioOption}>
        <Text style={styles.radioIcon}>{value === 'no' ? '🔘' : '⭕'}</Text>
        <Text style={styles.radioLabel}>No</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
          <Text style={styles.backArrowText}>{'←'}</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Volunteer Sign Up</Text>

        {/* Personal Info */}
        <TextInput style={styles.input} placeholder="Full Name" value={form.fullName} onChangeText={t => handleChange('fullName', t)} />
        <TextInput style={styles.input} placeholder="Date of Birth (MM/DD/YYYY)" value={form.dob} onChangeText={t => handleChange('dob', t)} />
        <TextInput style={styles.input} placeholder="Email Address" value={form.email} onChangeText={t => handleChange('email', t)} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Phone Number" value={form.phone} onChangeText={t => handleChange('phone', t)} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Address or City/Zip" value={form.address} onChangeText={t => handleChange('address', t)} />

        {/* Driving & Vehicle */}
        <Text style={styles.section}>Driver & Vehicle Info</Text>
        <Text style={styles.question}>Do you have a valid driver’s license?</Text>
        <YesNo value={form.hasLicense} onChange={v => handleChange('hasLicense', v)} />
        <TextInput style={styles.input} placeholder="License Number (optional)" value={form.licenseNumber} onChangeText={t => handleChange('licenseNumber', t)} />
        <Text style={styles.question}>Do you have your own vehicle?</Text>
        <YesNo value={form.hasVehicle} onChange={v => handleChange('hasVehicle', v)} />
        <TextInput style={styles.input} placeholder="Vehicle type & capacity (e.g., SUV, wheelchair)" value={form.vehicleType} onChangeText={t => handleChange('vehicleType', t)} />
        <TextInput style={styles.input} placeholder="Proof of insurance or registration" value={form.proof} onChangeText={t => handleChange('proof', t)} />

        {/* Experience */}
        <Text style={styles.section}>Experience & Qualifications</Text>
        <Text style={styles.question}>Willing to undergo background check?</Text>
        <YesNo value={form.backgroundCheck} onChange={v => handleChange('backgroundCheck', v)} />
        <Text style={styles.question}>Volunteered with seniors before?</Text>
        <YesNo value={form.volunteeredBefore} onChange={v => handleChange('volunteeredBefore', v)} />
        <Text style={styles.question}>First-aid/CPR trained?</Text>
        <YesNo value={form.firstAid} onChange={v => handleChange('firstAid', v)} />
        <Text style={styles.question}>Comfortable helping with mobility?</Text>
        <YesNo value={form.mobilityHelp} onChange={v => handleChange('mobilityHelp', v)} />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#DFF5E3',
    paddingBottom: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 20,
    marginTop: 60,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2F5233',
    borderRadius: 8,
    backgroundColor: '#FFFDF6',
    fontSize: 14,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    color: '#2F5233',
    alignSelf: 'flex-start',
  },
  question: {
    fontWeight: '500',
    color: '#2F5233',
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
  radioLabel: {
    fontSize: 16,
    color: '#2F5233',
  },
  submitButton: {
    backgroundColor: '#2F5233',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#FFFDF6',
    fontWeight: '600',
    fontSize: 18,
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  backArrowText: {
    fontSize: 32,
    color: '#2F5233',
  },
});

