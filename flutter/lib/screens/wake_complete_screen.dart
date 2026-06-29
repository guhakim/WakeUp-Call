import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../providers/rewards_provider.dart';
import '../widgets/stitch_divider.dart';

class WakeCompleteScreen extends ConsumerStatefulWidget {
  const WakeCompleteScreen({super.key});

  @override
  ConsumerState<WakeCompleteScreen> createState() => _WakeCompleteScreenState();
}

class _WakeCompleteScreenState extends ConsumerState<WakeCompleteScreen> {
  InterstitialAd? _interstitialAd;

  @override
  void initState() {
    super.initState();
    // 포인트 적립
    ref.read(rewardsProvider.notifier).addPoints(10, '⏰ 정시 기상');
    // TSK-006: AdMob 전면 광고 로드
    _loadAd();
  }

  void _loadAd() {
    // 테스트 ID (실제 배포 시 AdMob 콘솔 ID로 교체)
    const adUnitId = 'ca-app-pub-3940256099942544/1033173712';
    InterstitialAd.load(
      adUnitId: adUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
          // 1초 후 자동 노출
          Future.delayed(const Duration(seconds: 1), () {
            if (mounted) _interstitialAd?.show();
          });
        },
        onAdFailedToLoad: (_) {},
      ),
    );
  }

  @override
  void dispose() {
    _interstitialAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rewards = ref.watch(rewardsProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF4),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 20),
              const Text('＼(^o^)／', style: TextStyle(fontSize: 56)),
              const SizedBox(height: 12),
              const Text('오늘도 해냈어요!',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.w700)),
              Text('🔥 ${rewards.streak}일 연속 기상 중',
                style: const TextStyle(fontSize: 18, color: Color(0xFF8C8C8C))),

              const SizedBox(height: 24),

              // 리워드 카드
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('오늘 적립', style: TextStyle(fontSize: 16, color: Color(0xFF8C8C8C))),
                          const Text('+10 pt', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF3A9A6A))),
                        ],
                      ),
                      const StitchDivider(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('총 포인트', style: TextStyle(fontSize: 16, color: Color(0xFF8C8C8C))),
                          Text('${rewards.points} pt', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: rewards.points / 500,
                          minHeight: 14,
                          backgroundColor: const Color(0xFFEEEEEE),
                          valueColor: const AlwaysStoppedAnimation(Color(0xFF7EC8A4)),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text('기프티콘까지 ${500 - rewards.points}pt 남음',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF8C8C8C))),
                    ],
                  ),
                ),
              ),

              const Spacer(),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.go('/home'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF4A228),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    side: const BorderSide(color: Color(0xFF2D2D2D), width: 2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('홈으로 돌아가기', style: TextStyle(fontSize: 20, color: Color(0xFF2D2D2D))),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
