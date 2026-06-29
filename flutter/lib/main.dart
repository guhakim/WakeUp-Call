import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await MobileAds.instance.initialize();
  runApp(const ProviderScope(child: WakeUpCallApp()));
}

class WakeUpCallApp extends StatelessWidget {
  const WakeUpCallApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'WakeUp Call',
      theme: _buildTheme(),
      routerConfig: appRouter,
      debugShowCheckedModeBanner: false,
    );
  }

  ThemeData _buildTheme() {
    // Material 3 Stitch 테마
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFF4A228),
        brightness: Brightness.light,
      ),
      fontFamily: 'Gaegu',        // 손글씨 폰트 유지
      scaffoldBackgroundColor: const Color(0xFFFDFBF4),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF2D2D2D), width: 2),
        ),
        color: Colors.white,
      ),
      dividerTheme: const DividerThemeData(
        color: Color(0xFF8C8C8C),
        thickness: 1.5,
      ),
    );
  }
}
