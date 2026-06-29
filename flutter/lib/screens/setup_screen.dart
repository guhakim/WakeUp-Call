import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/stitch_divider.dart';

class SetupScreen extends StatefulWidget {
  const SetupScreen({super.key});

  @override
  State<SetupScreen> createState() => _SetupScreenState();
}

class _SetupScreenState extends State<SetupScreen> {
  final _ctrl = TextEditingController();
  String? _error;

  @override
  void initState() {
    super.initState();
    _checkExisting();
  }

  Future<void> _checkExisting() async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getString('phone_number') != null && mounted) {
      context.go('/home');
    }
  }

  Future<void> _submit() async {
    final phone = _ctrl.text.replaceAll(RegExp(r'[\s\-]'), '');
    if (!RegExp(r'^01[0-9]{8,9}$').hasMatch(phone)) {
      setState(() => _error = '올바른 번호를 입력해주세요 (예: 01012345678)');
      return;
    }
    final intl = '+82${phone.substring(1)}';
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('phone_number', intl);
    await prefs.setString('user_id', 'user-${DateTime.now().millisecondsSinceEpoch}');
    if (mounted) context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF4),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('📞', style: TextStyle(fontSize: 56)),
              const SizedBox(height: 16),
              const Text('웨이크업 콜', style: TextStyle(fontSize: 34, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              const Text('못 일어나면 이 번호로\n직접 전화해드릴게요!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18, color: Color(0xFF8C8C8C), height: 1.5)),
              const SizedBox(height: 32),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('내 휴대폰 번호', style: TextStyle(fontSize: 16, color: Color(0xFF8C8C8C))),
                      TextField(
                        controller: _ctrl,
                        keyboardType: TextInputType.phone,
                        maxLength: 11,
                        style: const TextStyle(fontSize: 28, letterSpacing: 2),
                        decoration: const InputDecoration(
                          hintText: '01012345678',
                          border: UnderlineInputBorder(),
                          counterText: '',
                        ),
                      ),
                      if (_error != null) ...[
                        const SizedBox(height: 4),
                        Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 13)),
                      ],
                      const StitchDivider(),
                      const Text('📋 자동 전화 수신에 동의하고 시작합니다',
                        style: TextStyle(fontSize: 13, color: Color(0xFF8C8C8C))),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF4A228),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    side: const BorderSide(color: Color(0xFF2D2D2D), width: 2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('시작하기 →', style: TextStyle(fontSize: 20, color: Color(0xFF2D2D2D))),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
